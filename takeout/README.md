# Takeout inbox

Drop your monthly Google Takeout list here and the site updates itself.

## From your phone (monthly, ~1 minute)

1. In the Takeout email, download the export. Tap the zip in the Files
   app to extract it, and find `Takeout/Saved/Favorite places.csv`.
2. Open this bookmark in your browser:
   https://github.com/Hannazzzzz/cph-food-files-v0.1/upload/main/takeout
   and upload that CSV. Press "Commit changes".

That's it. Within a few minutes a robot will:
- add places you saved, remove places you un-saved
- fetch details (address, rating, coordinates) for new places
- delete your uploaded file from this folder
- redeploy the website
- open an issue listing new places that still need food/mood tags

## Privacy warning

This repository is PUBLIC. Upload only `Favorite places.csv`, NOT the
whole Takeout zip - the zip contains all your other saved lists too,
and anything committed here stays visible in the git history forever.
(If you do upload a zip, the robot will still process it, but the zip
will have been public.)
