# Files to Copy from Scraper Repo

## 📁 Copy to `scripts/` directory

Copy these files from your scraper repo's root to the new `scripts/` folder:

```
From scraper repo root → To website repo scripts/
├── harvest_restaurants.py  → scripts/harvest_restaurants.py
├── test_run.py            → scripts/test_run.py
├── test_tag_logic.py      → scripts/test_tag_logic.py
├── RUN_ME.sh              → scripts/RUN_ME.sh
├── requirements.txt       → scripts/requirements.txt
└── HOW_TO_RUN.txt         → scripts/HOW_TO_RUN.txt
```

## 📄 Copy to root directory (if needed)

These files should already exist in the website repo root. Only copy if they're newer/different:

```
From scraper repo root → To website repo root
├── Fastelavnsbolle_enriched.csv  → Fastelavnsbolle_enriched.csv (already exists)
├── Fastelavnsbolle.csv           → Fastelavnsbolle.csv (already exists)
└── Favorite places.csv           → Favorite places.csv (copy if used by scraper)
```

⚠️ **NOTE**: The website already reads from these CSV files in the root directory, so they're already in place!

## 📚 Copy to `docs/` directory

Copy reference materials:

```
From scraper repo root → To website repo docs/
└── PostalcodesEnglish.pdf  → docs/PostalcodesEnglish.pdf
```

## ❌ DO NOT Copy

These files/folders should NOT be copied:
- `.git/` directory (different repository)
- `node_modules/` or `__pycache__/` (generated files)
- `.env` files (if any - configure separately)
- Any IDE-specific files (`.vscode/`, `.idea/`)

## ✅ Quick Checklist

- [ ] Copied 6 Python files to `scripts/`
- [ ] Copied PostalcodesEnglish.pdf to `docs/`
- [ ] (Optional) Copied "Favorite places.csv" to root if needed
- [ ] Made RUN_ME.sh executable: `chmod +x scripts/RUN_ME.sh`

## 🚀 After Copying

1. Navigate to scripts folder: `cd scripts`
2. Install dependencies: `pip install -r requirements.txt`
3. Test the scraper: `./RUN_ME.sh`
4. Check that `Fastelavnsbolle_enriched.csv` gets updated in root
5. Rebuild website to see changes: `npm run dev`
