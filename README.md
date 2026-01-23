# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Data Scraper

This project includes a Python scraper to harvest restaurant data from Google Maps.

### Setup

1. Install Python dependencies:
```sh
pip3 install -r scripts/requirements.txt
```

2. Run the scraper:
```sh
# Quick test run (3 restaurants only)
python3 scripts/test_run.py Fastelavnsbolle.csv

# Full scraper
python3 scripts/harvest_restaurants.py Fastelavnsbolle.csv
```

3. The scraper will update `Fastelavnsbolle_enriched.csv` in the root directory
4. The website will automatically use the updated data on next build/refresh

**Note:** Run these commands from the root directory of this repository.

### Scraper Files

- `scripts/harvest_restaurants.py` - Main scraper script
- `scripts/test_run.py` - Test script for 3 restaurants
- `scripts/test_tag_logic.py` - Tests tag preservation logic
- `scripts/RUN_ME.sh` - Quick run script
- `scripts/requirements.txt` - Python dependencies
- `scripts/HOW_TO_RUN.txt` - Detailed instructions

### Reference Materials

- `docs/PostalcodesEnglish.pdf` - Copenhagen postal code reference
