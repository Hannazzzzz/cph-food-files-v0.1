#!/usr/bin/env python3
"""Quick test - process only the first 3 places of a CSV.

Usage: python3 test_run.py "Favorite_places_march_2026.csv"
Writes to <input>_test_results.csv so your real enriched file is untouched.
"""
import sys
from harvest_restaurants import RestaurantHarvester

input_file = sys.argv[1] if len(sys.argv) > 1 else 'Favorite places.csv'
output_file = input_file.replace('.csv', '') + '_test_results.csv'

print("=" * 60)
print(f"TEST RUN - first 3 places from {input_file}")
print("=" * 60)

harvester = RestaurantHarvester(headless=True)
try:
    results = harvester.process_csv(input_file, output_file, limit=3)
    print(f"\nDone: {sum(1 for r in results if r['status'] == 'success')}/3 succeeded")
    print(f"Results in: {output_file}")
finally:
    harvester.close()
