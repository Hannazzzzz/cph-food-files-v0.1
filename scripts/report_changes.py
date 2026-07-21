#!/usr/bin/env python3
"""
Compare two versions of the enriched CSV and report closure-flag changes:
newly permanently closed, newly temporarily closed, and reopened places.
Everything else (adds, removals, ratings, hours) is deliberately ignored
for notification purposes; pass --all to include adds/removals too.

Usage: python3 report_changes.py old.csv new.csv [--all]
Prints a markdown summary to stdout; prints NOTHING when there are no
meaningful changes (so callers can test for empty output).
"""

import sys

from harvest_restaurants import read_places_csv, get_name_and_url, extract_place_id


def key_of(row):
    name, url = get_name_and_url(row)
    return extract_place_id(url) or url or name


def flag(row, col):
    return (row.get(col) or 'No').strip().lower() == 'yes'


def compare(old_rows, new_rows):
    """Return dict of meaningful changes between two CSV versions."""
    old = {key_of(r): r for r in old_rows if key_of(r)}
    new = {key_of(r): r for r in new_rows if key_of(r)}

    added = [new[k] for k in new.keys() - old.keys()]
    removed = [old[k] for k in old.keys() - new.keys()]

    perm_closed, temp_closed, reopened = [], [], []
    for k in old.keys() & new.keys():
        o, n = old[k], new[k]
        if not flag(o, 'permanently_closed') and flag(n, 'permanently_closed'):
            perm_closed.append(n)
        if not flag(o, 'temporarily_closed') and flag(n, 'temporarily_closed'):
            temp_closed.append(n)
        was_closed = flag(o, 'permanently_closed') or flag(o, 'temporarily_closed')
        now_open = not (flag(n, 'permanently_closed') or flag(n, 'temporarily_closed'))
        if was_closed and now_open:
            reopened.append(n)
    return {
        'added': added, 'removed': removed,
        'perm_closed': perm_closed, 'temp_closed': temp_closed,
        'reopened': reopened,
    }


def names(rows):
    return ', '.join(sorted(get_name_and_url(r)[0] for r in rows))


def render(changes, include_membership=False):
    """Markdown summary; empty string when nothing meaningful changed."""
    lines = []
    if include_membership and changes['added']:
        lines.append(f"**Added ({len(changes['added'])}):** {names(changes['added'])}")
    if include_membership and changes['removed']:
        lines.append(f"**Removed ({len(changes['removed'])}):** {names(changes['removed'])}")
    if changes['perm_closed']:
        lines.append(f"**Newly permanently closed, now hidden ({len(changes['perm_closed'])}):** {names(changes['perm_closed'])}")
    if changes['temp_closed']:
        lines.append(f"**Newly temporarily closed ({len(changes['temp_closed'])}):** {names(changes['temp_closed'])}")
    if changes['reopened']:
        lines.append(f"**Reopened ({len(changes['reopened'])}):** {names(changes['reopened'])}")
    return '\n\n'.join(lines)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    include_membership = '--all' in sys.argv
    if len(args) != 2:
        print(__doc__, file=sys.stderr)
        raise SystemExit(2)
    old_rows = read_places_csv(args[0])
    new_rows = read_places_csv(args[1])
    summary = render(compare(old_rows, new_rows), include_membership)
    if summary:
        print(summary)


if __name__ == '__main__':
    main()
