#!/bin/bash
# Restaurant Harvester - Simple Runner
# Usage: ./RUN_ME.sh "Favorite_places_march_2026.csv"

set -e
INPUT="${1:-Favorite places.csv}"

echo "==================================================="
echo "Restaurant Data Harvester v2"
echo "Input: $INPUT"
echo "==================================================="

if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed."
    exit 1
fi

if [ ! -f "$INPUT" ]; then
    echo "ERROR: Input file not found: $INPUT"
    echo "Run this from the folder containing your CSV, e.g.:"
    echo "  cd ~/Documents/'Restaurant Guide'"
    exit 1
fi

echo "Installing required packages (first run only takes a minute)..."
pip3 install -q selenium webdriver-manager 2>/dev/null || pip3 install -q selenium webdriver-manager --break-system-packages

# Mac Chrome lives in /Applications and isn't on PATH - check both
if ! command -v google-chrome &> /dev/null && ! command -v chromium &> /dev/null \
   && [ ! -d "/Applications/Google Chrome.app" ]; then
    echo "WARNING: Google Chrome not found. Install it first:"
    echo "  Mac: brew install --cask google-chrome (or download from google.com/chrome)"
    exit 1
fi

echo ""
echo "Starting... progress is saved after every place, so it's safe to"
echo "interrupt and re-run. Log: harvest.log"
echo ""

python3 harvest_restaurants.py "$INPUT"

echo ""
echo "Done! Check the summary above for failures and closures."
