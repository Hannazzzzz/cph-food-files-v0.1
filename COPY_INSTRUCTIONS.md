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
├── Favorite places_enriched.csv  → Favorite places_enriched.csv (already exists)
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

1. Install Python dependencies:
   ```bash
   pip3 install -r scripts/requirements.txt
   ```

2. Test the scraper (3 restaurants only):
   ```bash
   python3 scripts/test_run.py Fastelavnsbolle.csv
   ```

3. Run the full scraper:
   ```bash
   python3 scripts/harvest_restaurants.py Fastelavnsbolle.csv
   ```

4. The scraper will update `Favorite places_enriched.csv` in the root directory

5. Rebuild website to see changes:
   ```bash
   npm run dev
   ```

**Note:** Run these commands from the **root of the website repository** so the CSV file paths are correct.
