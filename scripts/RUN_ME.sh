#!/bin/bash
# Restaurant Harvester - Simple Runner
# Just run this file and it does everything

echo "==================================================="
echo "Restaurant Data Harvester"
echo "==================================================="
echo ""
echo "This will process all 164 restaurants from 'Favorite places.csv'"
echo "and create 'restaurants_enriched.csv' with all the details."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed."
    echo "Please install Python3 first."
    exit 1
fi

# Install dependencies
echo "Installing required packages..."
pip3 install -q selenium webdriver-manager

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null && ! command -v chromium &> /dev/null; then
    echo ""
    echo "WARNING: Chrome/Chromium not found."
    echo "Please install Google Chrome or Chromium browser."
    echo ""
    echo "On Ubuntu/Debian:"
    echo "  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
    echo "  sudo apt install ./google-chrome-stable_current_amd64.deb"
    echo ""
    echo "On Mac:"
    echo "  brew install --cask google-chrome"
    echo ""
    exit 1
fi

echo ""
echo "==================================================="
echo "Starting harvester..."
echo "This will take about 10-15 minutes for 164 restaurants"
echo "Progress is saved every 10 restaurants"
echo "==================================================="
echo ""

# Run the harvester
python3 harvest_restaurants.py

echo ""
echo "==================================================="
echo "Done!"
echo "Check 'restaurants_enriched.csv' for results"
echo "==================================================="
