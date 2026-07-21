# Monthly update workflow

Data source of truth: the "Favorite places" saved list in Google Maps.
A scheduled Google Takeout exports it monthly.

## The monthly ritual

1. When the Takeout email arrives, download the zip (no need to unzip)
   and drop it in the Restaurant Guide folder (iCloud), or attach it in
   a Cowork/Claude session.
2. Tell Claude: "monthly update". Claude will:
   - diff the Takeout list against the live site data (by Google place ID)
   - show you what's new and what you've un-saved, and confirm removals
   - scrape details for new places and re-check closures
   - ask you for food/mood tags for the new places (or propose some)
   - commit and push, which redeploys the site automatically
3. Done. Total effort on your side: drag one file, answer two questions.

## Doing it without Claude (one command)

    cd ~/Documents/"Restaurant Guide"
    python3 scripts/update_from_takeout.py takeout-2026XXXX.zip "Favorite places_enriched.csv"

Then add tags for any new places (the script lists them), commit, push.

Options:
    --dry-run     see the diff without changing or scraping anything
    --new-only    quick run: only scrape newly added places
    --list=NAME   use a different saved list from the zip

## Safety properties

- A dated backup of the enriched CSV is written before any change.
- Manual food/mood tags survive every run (matched by place ID, so
  Google renames and duplicate names are safe).
- Places that disappear from your saved list are removed from the site;
  permanently closed places are kept in the CSV but hidden by the site.
- One failing place never aborts the run; re-running retries failures
  and changes nothing else.
- Everything is in git, so any update can be rolled back.
