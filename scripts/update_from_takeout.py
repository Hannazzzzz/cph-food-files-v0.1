#!/usr/bin/env python3
"""
Monthly site update from a Google Takeout export.

Compares your Takeout saved-places list against the site's enriched CSV:
  - NEW places (saved since last time)     -> scraped and added
  - REMOVED places (un-saved by you)       -> dropped (backup kept)
  - EXISTING places                        -> refreshed (closure check etc.)
                                              unless --new-only is given

Manual food_tags / mood_tags are always preserved (keyed by place ID).

Usage:
  python3 update_from_takeout.py takeout-2026XXXX.zip "Favorite places_enriched.csv"
  python3 update_from_takeout.py "Favorite places.csv" "Favorite places_enriched.csv"

Options:
  --new-only     only scrape newly added places (quick); existing rows kept as-is
  --dry-run      show the diff, change nothing, scrape nothing
  --list=NAME    which saved list to use from the Takeout zip
                 (default: "Favorite places")
"""

import csv
import io
import os
import shutil
import sys
import zipfile
from datetime import date

from harvest_restaurants import (
    read_places_csv, get_name_and_url, extract_place_id, dedupe_rows,
    load_existing_tags, save_results, OUTPUT_FIELDS, sniff_delimiter,
)


def read_takeout(path, list_name='Favorite places'):
    """Return rows from a Takeout zip or a plain CSV file."""
    if path.lower().endswith('.zip'):
        with zipfile.ZipFile(path) as z:
            matches = [n for n in z.namelist()
                       if n.lower().endswith(f'{list_name.lower()}.csv')]
            if not matches:
                available = [n for n in z.namelist() if n.endswith('.csv')]
                raise SystemExit(
                    f"Could not find '{list_name}.csv' in the zip.\n"
                    "CSV files present:\n  " + "\n  ".join(available))
            with z.open(matches[0]) as f:
                text = io.TextIOWrapper(f, encoding='utf-8-sig', newline='')
                first_line = text.readline()
                delimiter = sniff_delimiter(first_line)
            with z.open(matches[0]) as f:
                text = io.TextIOWrapper(f, encoding='utf-8-sig', newline='')
                reader = csv.DictReader(text, delimiter=delimiter)
                return [{(k or '').strip(): (v or '').strip()
                         for k, v in row.items() if k is not None}
                        for row in reader]
    return read_places_csv(path)


def key_of(row):
    name, url = get_name_and_url(row)
    return extract_place_id(url) or url or name


def diff_places(takeout_rows, enriched_rows):
    """Return (new_rows, removed_rows, kept_rows) using place-ID keys."""
    takeout_rows = dedupe_rows([r for r in takeout_rows if all(get_name_and_url(r))])
    enriched_by_key = {key_of(r): r for r in enriched_rows if key_of(r)}
    takeout_keys = {key_of(r) for r in takeout_rows}

    new = [r for r in takeout_rows if key_of(r) not in enriched_by_key]
    removed = [r for k, r in enriched_by_key.items() if k not in takeout_keys]
    kept = [r for k, r in enriched_by_key.items() if k in takeout_keys]
    return new, removed, kept


def enriched_row_from_scrape(data):
    row = {f: '' for f in OUTPUT_FIELDS}
    row.update({k: v for k, v in data.items() if k in row})
    return row


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = {a.split('=')[0]: (a.split('=')[1] if '=' in a else True)
             for a in sys.argv[1:] if a.startswith('--')}

    if len(args) < 2:
        print(__doc__)
        raise SystemExit(1)

    takeout_path, enriched_path = args[0], args[1]
    list_name = flags.get('--list', 'Favorite places')
    new_only = '--new-only' in flags
    dry_run = '--dry-run' in flags

    takeout_rows = read_takeout(takeout_path, list_name)
    enriched_rows = read_places_csv(enriched_path) if os.path.exists(enriched_path) else []

    new, removed, kept = diff_places(takeout_rows, enriched_rows)

    print("=" * 60)
    print(f"Takeout list:   {len(takeout_rows)} places  ({takeout_path})")
    print(f"Currently live: {len(enriched_rows)} places  ({enriched_path})")
    print(f"  NEW (to add):       {len(new)}")
    for r in new:
        print(f"    + {get_name_and_url(r)[0]}")
    print(f"  REMOVED (un-saved): {len(removed)}")
    for r in removed:
        print(f"    - {get_name_and_url(r)[0]}")
    print(f"  KEPT:               {len(kept)}")
    print("=" * 60)

    if dry_run:
        print("Dry run - nothing changed.")
        return

    if not new and not removed and new_only:
        print("Nothing to do.")
        return

    # Backup before touching anything
    if os.path.exists(enriched_path):
        backup = f"{enriched_path}.backup-{date.today().isoformat()}"
        shutil.copy2(enriched_path, backup)
        print(f"Backup saved: {backup}")

    from harvest_restaurants import RestaurantHarvester
    harvester = RestaurantHarvester(headless=True)
    harvester.existing_tags = load_existing_tags(enriched_path)
    results = []
    try:
        if new_only:
            # keep existing rows untouched, scrape only new places
            results.extend(kept)
            todo = new
        else:
            # full refresh: rescrape everything still in the list, plus new
            todo = kept + new

        total = len(todo)
        for idx, row in enumerate(todo, 1):
            name, url = get_name_and_url(row)
            print(f"[{idx}/{total}] {name}")
            data = harvester.harvest_restaurant(name, url)
            if data['status'] != 'success':
                data = harvester.harvest_restaurant(name, url)  # one retry
            # tags in the current enriched row win if scrape lost them
            if not data['food_tags'] and row.get('food_tags'):
                data['food_tags'] = row['food_tags']
            if not data['mood_tags'] and row.get('mood_tags'):
                data['mood_tags'] = row['mood_tags']
            results.append(enriched_row_from_scrape(data))
            save_results(sorted(results, key=lambda r: r['name'].lower()), enriched_path)
    finally:
        harvester.close()

    results.sort(key=lambda r: r['name'].lower())
    save_results(results, enriched_path)

    untagged = [r['name'] for r in results if not (r.get('food_tags') or '').strip()]
    failed = [r['name'] for r in results if not (r.get('status') or 'success').startswith('success')]
    perm = [r['name'] for r in results if r.get('permanently_closed') == 'Yes']
    print("=" * 60)
    print(f"Done: {len(results)} places written to {enriched_path}")
    if perm:
        print(f"Permanently closed (hidden by the site automatically): {', '.join(perm)}")
    if failed:
        print(f"FAILED (re-run to retry): {', '.join(failed)}")
    if untagged:
        print(f"NEW places needing food/mood tags: {', '.join(untagged)}")
    print("Next: add tags for new places, then commit & push to publish.")
    print("=" * 60)


if __name__ == '__main__':
    main()
