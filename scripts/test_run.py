#!/usr/bin/env python3
"""Quick test - process first 3 restaurants only"""

import csv
import os
import sys
from harvest_restaurants import RestaurantHarvester

# Allow specifying input file as command-line argument
if len(sys.argv) > 1:
    input_file = sys.argv[1]
else:
    input_file = 'Favorite places.csv'  # Default

# Read first 3 restaurants
with open(input_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    restaurants = list(reader)[:3]  # First 3 only

base_name = input_file.replace('.csv', '')
output_file = f'{base_name}_test_results.csv'

print("=" * 60)
print(f"TEST RUN - Processing 3 restaurants from {input_file}")
print("=" * 60)
print()

harvester = RestaurantHarvester(headless=True)
results = []

try:
    for idx, row in enumerate(restaurants, 1):
        name = (row.get('Title') or row.get('name') or '').strip()
        url = (row.get('URL') or row.get('maps url') or '').strip()

        if not name or not url:
            continue

        print(f"[{idx}/3] Processing: {name}...")
        data = harvester.harvest_restaurant(name, url)
        results.append(data)

        # Save after each restaurant (safer in case of crashes)
        fieldnames = ['name', 'keywords', 'food_tags', 'mood_tags', 'address', 'neighborhood',
                     'latitude', 'longitude', 'rating', 'reviews_count', 'price_level',
                     'phone', 'website', 'hours', 'permanently_closed', 'temporarily_closed',
                     'maps url', 'status']

        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)

        print(f"    ✓ Done (saved to {os.path.abspath(output_file)})")
        print()

    print("=" * 60)
    if results:
        print("✓ Test complete!")
        print(f"Results saved to: {os.path.abspath(output_file)}")
    else:
        print("⚠ No results collected.")
        print("Check that your CSV has 'Title' and 'URL' columns (Google Maps export format).")
        print(f"Columns found: {list(restaurants[0].keys()) if restaurants else 'none - file may be empty'}")
    print("=" * 60)

finally:
    harvester.close()
