#!/usr/bin/env python3
"""
Restaurant Data Harvester
Automatically extracts information from Google Maps links including:
- Address
- Coordinates (latitude, longitude)
- Phone
- Website
- Rating & reviews
- Price level
- Opening hours
"""

import csv
import time
import re
import json
import os
from urllib.parse import unquote
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('harvest.log'),
        logging.StreamHandler()
    ]
)

# Copenhagen postal code to neighborhood mapping
POSTAL_CODE_NEIGHBORHOODS = {
    # Specific neighborhoods in Indre By area
    # Refshaleøen
    range(1432, 1434): "Refshaleøen",
    # Holmen
    range(1434, 1442): "Holmen",
    # Indre By (Inner City) - 1xxx codes (general catch-all)
    range(1000, 1500): "Indre By",
    # Vesterbro - 1500-1799
    range(1500, 1800): "Vesterbro",
    # Frederiksberg - 1800-2000
    range(1800, 2000): "Frederiksberg",
    # Østerbro - 2100
    range(2100, 2101): "Østerbro",
    # Nørrebro - 2200
    range(2200, 2201): "Nørrebro",
    # Amager - 2300
    range(2300, 2301): "Amager",
    # Nordvest - 2400
    range(2400, 2401): "Nordvest",
    # Sydhavn - 2450
    range(2450, 2451): "Sydhavn",
    # Valby - 2500
    range(2500, 2501): "Valby",
    # Glostrup - 2600
    range(2600, 2601): "Glostrup",
    # Brøndby - 2605
    range(2605, 2606): "Brøndby",
    # Rødovre - 2610
    range(2610, 2611): "Rødovre",
    # Albertslund - 2620
    range(2620, 2621): "Albertslund",
    # Vallensbæk - 2625
    range(2625, 2626): "Vallensbæk",
    # Taastrup - 2630
    range(2630, 2631): "Taastrup",
    # Ishøj - 2635
    range(2635, 2636): "Ishøj",
    # Hedehusene - 2640
    range(2640, 2641): "Hedehusene",
    # Hvidovre - 2650
    range(2650, 2651): "Hvidovre",
    # Brøndby Strand - 2660
    range(2660, 2661): "Brøndby Strand",
    # Vallensbæk Strand - 2665
    range(2665, 2666): "Vallensbæk Strand",
    # Greve - 2670
    range(2670, 2671): "Greve",
    # Solrød Strand - 2680
    range(2680, 2681): "Solrød Strand",
    # Karlslunde - 2690
    range(2690, 2691): "Karlslunde",
    # Brønshøj - 2700
    range(2700, 2701): "Brønshøj",
    # Vanløse - 2720
    range(2720, 2721): "Vanløse",
    # Herlev - 2730
    range(2730, 2731): "Herlev",
    # Skovlunde - 2740
    range(2740, 2741): "Skovlunde",
    # Ballerup - 2750
    range(2750, 2751): "Ballerup",
    # Måløv - 2760
    range(2760, 2761): "Måløv",
    # Smørum - 2765
    range(2765, 2766): "Smørum",
    # Kastrup - 2770
    range(2770, 2771): "Kastrup",
    # Dragør - 2791
    range(2791, 2792): "Dragør",
    # Kongens Lyngby - 2800
    range(2800, 2801): "Kongens Lyngby",
    # Gentofte - 2820
    range(2820, 2821): "Gentofte",
    # Virum - 2830
    range(2830, 2831): "Virum",
    # Holte - 2840
    range(2840, 2841): "Holte",
    # Nærum - 2850
    range(2850, 2851): "Nærum",
    # Søborg - 2860
    range(2860, 2861): "Søborg",
    # Dyssegård - 2870
    range(2870, 2871): "Dyssegård",
    # Bagsværd - 2880
    range(2880, 2881): "Bagsværd",
    # Hellerup - 2900
    range(2900, 2901): "Hellerup",
    # Charlottenlund - 2920
    range(2920, 2921): "Charlottenlund",
    # Klampenborg - 2930
    range(2930, 2931): "Klampenborg",
}

class RestaurantHarvester:
    def __init__(self, headless=True):
        """Initialize the harvester with Chrome driver"""
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        # Use webdriver-manager to automatically manage ChromeDriver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)

        # Store existing tags (will be populated before processing)
        self.existing_tags = {}

    def _load_existing_tags(self, output_file):
        """Load existing food_tags and mood_tags from the output CSV if it exists"""
        if not os.path.exists(output_file):
            logging.info("No existing output file found - all tags will start empty")
            return

        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                # Detect delimiter by reading first line
                first_line = f.readline()
                f.seek(0)  # Reset to beginning

                # Use semicolon if it appears more than comma in header
                delimiter = ';' if first_line.count(';') > first_line.count(',') else ','

                reader = csv.DictReader(f, delimiter=delimiter)
                for row in reader:
                    name = row.get('name', '').strip()
                    maps_url = row.get('maps url', '').strip()

                    # Use both name and URL as keys for robust matching
                    food_tags = row.get('food_tags', '').strip()
                    mood_tags = row.get('mood_tags', '').strip()

                    # Store tags if they're not empty
                    if food_tags or mood_tags:
                        # Create composite key: use name primarily, fallback to URL
                        key = name if name else maps_url
                        self.existing_tags[key] = {
                            'food_tags': food_tags,
                            'mood_tags': mood_tags
                        }
                        logging.debug(f"Loaded existing tags for: {name}")

            if self.existing_tags:
                logging.info(f"Loaded existing tags for {len(self.existing_tags)} restaurants")
            else:
                logging.info("No existing tags found in output file")
        except Exception as e:
            logging.warning(f"Could not load existing tags: {e}")

    def extract_place_id(self, url):
        """Extract place ID from Google Maps URL"""
        # Pattern: 1s0x... after /place/
        match = re.search(r'1s(0x[a-f0-9]+:[0-9a-fx]+)', url)
        if match:
            return match.group(1)
        return None

    def extract_postal_code(self, address):
        """Extract postal code from address string"""
        if not address:
            return None
        # Match 4-digit postal code in Danish address format
        match = re.search(r'\b(\d{4})\b', address)
        if match:
            return int(match.group(1))
        return None

    def get_neighborhood(self, postal_code):
        """Map postal code to neighborhood name"""
        if not postal_code:
            return ""

        for postal_range, neighborhood in POSTAL_CODE_NEIGHBORHOODS.items():
            if postal_code in postal_range:
                return neighborhood

        # If no match found, return empty string
        return ""

    def get_text_safe(self, selector, by=By.CSS_SELECTOR):
        """Safely get text from element"""
        try:
            element = self.driver.find_element(by, selector)
            return element.text.strip()
        except:
            return ""

    def get_attribute_safe(self, selector, attribute, by=By.CSS_SELECTOR):
        """Safely get attribute from element"""
        try:
            element = self.driver.find_element(by, selector)
            return element.get_attribute(attribute)
        except:
            return ""

    def extract_coordinates(self, max_retries=3):
        """Extract latitude and longitude from the page"""
        # Try multiple times in case the page is still loading
        for attempt in range(max_retries):
            try:
                # Try to get from current URL after page loads
                current_url = self.driver.current_url
                # Pattern: @latitude,longitude,zoom
                match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', current_url)
                if match:
                    lat, lng = match.group(1), match.group(2)
                    logging.debug(f"Extracted coordinates from URL: {lat}, {lng}")
                    return lat, lng

                # Try from page source
                page_source = self.driver.page_source
                # Look for coordinates in various formats
                coord_patterns = [
                    r'"latitude":(-?\d+\.\d+).*?"longitude":(-?\d+\.\d+)',
                    r'"lat":(-?\d+\.\d+).*?"lng":(-?\d+\.\d+)',
                ]
                for pattern in coord_patterns:
                    match = re.search(pattern, page_source)
                    if match:
                        lat, lng = match.group(1), match.group(2)
                        logging.debug(f"Extracted coordinates from page source: {lat}, {lng}")
                        return lat, lng
            except Exception as e:
                logging.debug(f"Coordinate extraction attempt {attempt + 1} failed: {e}")

            # If we didn't find coordinates, wait a bit and try again
            if attempt < max_retries - 1:
                time.sleep(2)
                logging.debug(f"Retrying coordinate extraction (attempt {attempt + 2}/{max_retries})")

        logging.warning("Could not extract coordinates after all retries")
        return '', ''


    def harvest_restaurant(self, name, url):
        """Harvest data from a single restaurant"""
        logging.info(f"Processing: {name}")

        # Check if we have existing tags for this restaurant
        existing = self.existing_tags.get(name, {})
        food_tags = existing.get('food_tags', '')
        mood_tags = existing.get('mood_tags', '')

        if food_tags or mood_tags:
            logging.info(f"  → Preserving existing tags for {name}")

        data = {
            'name': name,
            'maps url': url,
            'address': '',
            'neighborhood': '',
            'latitude': '',
            'longitude': '',
            'phone': '',
            'website': '',
            'rating': '',
            'reviews_count': '',
            'price_level': '',
            'food_tags': food_tags,  # Use existing tags if available
            'mood_tags': mood_tags,  # Use existing tags if available
            'hours': '',
            'permanently_closed': 'No',
            'temporarily_closed': 'No',
            'status': 'success'
        }

        try:
            # Load the page
            self.driver.get(url)
            time.sleep(3)  # Wait for page to load

            # Handle cookie consent popup
            try:
                # Wait a bit for popup to appear
                time.sleep(2)

                # Try different cookie button selectors
                cookie_selectors = [
                    "//button[contains(., 'Accept all')]",
                    "//button[contains(., 'Reject all')]",
                    "//button[contains(., 'Accept')]",
                    "//button[@aria-label='Accept all']",
                    "form[action*='consent'] button",
                ]

                for selector in cookie_selectors:
                    try:
                        if selector.startswith('//'):
                            button = self.driver.find_element(By.XPATH, selector)
                        else:
                            button = self.driver.find_element(By.CSS_SELECTOR, selector)
                        button.click()
                        logging.info(f"Clicked cookie consent button")
                        time.sleep(2)  # Wait for popup to close
                        break
                    except:
                        continue
            except:
                pass

            # Check if permanently closed
            try:
                # Look for "Permanently closed" text
                page_text = self.driver.page_source.lower()
                if 'permanently closed' in page_text or 'permanent closure' in page_text:
                    data['permanently_closed'] = 'Yes'
                    logging.warning(f"⚠ {name} is permanently closed")

                # Also check for the specific element
                closed_elements = self.driver.find_elements(By.XPATH,
                    "//*[contains(text(), 'Permanently closed') or contains(text(), 'permanent closure')]")
                if closed_elements:
                    data['permanently_closed'] = 'Yes'
            except:
                pass

            # Check if temporarily closed
            try:
                page_text = self.driver.page_source.lower()
                if 'temporarily closed' in page_text or 'temporary closure' in page_text:
                    data['temporarily_closed'] = 'Yes'
                    logging.warning(f"⚠ {name} is temporarily closed")

                # Also check for the specific element
                temp_closed_elements = self.driver.find_elements(By.XPATH,
                    "//*[contains(text(), 'Temporarily closed') or contains(text(), 'temporary closure')]")
                if temp_closed_elements:
                    data['temporarily_closed'] = 'Yes'
            except:
                pass

            # Extract rating
            try:
                rating_elem = self.driver.find_element(By.CSS_SELECTOR, 'div.F7nice span[aria-hidden="true"]')
                data['rating'] = rating_elem.text.strip()
            except:
                pass

            # Extract review count
            try:
                reviews_elem = self.driver.find_element(By.CSS_SELECTOR, 'div.F7nice span[aria-label*="reviews"]')
                reviews_text = reviews_elem.text.strip()
                match = re.search(r'[\d,]+', reviews_text)
                if match:
                    data['reviews_count'] = match.group()
            except:
                pass

            # Extract price level
            try:
                price_elem = self.driver.find_element(By.CSS_SELECTOR, 'span[aria-label*="Price"]')
                data['price_level'] = price_elem.text.strip()
            except:
                pass

            # Extract address
            try:
                address_elem = self.driver.find_element(By.CSS_SELECTOR, 'button[data-item-id="address"]')
                data['address'] = address_elem.get_attribute('aria-label').replace('Address: ', '')

                # Derive neighborhood from postal code
                postal_code = self.extract_postal_code(data['address'])
                if postal_code:
                    data['neighborhood'] = self.get_neighborhood(postal_code)
            except:
                pass

            # Extract coordinates from loaded page
            lat, lng = self.extract_coordinates()
            data['latitude'] = lat
            data['longitude'] = lng

            # Extract phone
            try:
                phone_elem = self.driver.find_element(By.CSS_SELECTOR, 'button[data-item-id*="phone"]')
                phone_text = phone_elem.get_attribute('aria-label')
                if phone_text:
                    data['phone'] = phone_text.replace('Phone: ', '').replace('Copy phone number', '').strip()
            except:
                pass

            # Extract website
            try:
                website_elem = self.driver.find_element(By.CSS_SELECTOR, 'a[data-item-id="authority"]')
                data['website'] = website_elem.get_attribute('href')
            except:
                pass

            # Extract hours status (Open/Closed)
            try:
                hours_elem = self.driver.find_element(By.CSS_SELECTOR, 'div.o0Svhf span')
                data['hours'] = hours_elem.text.strip()
            except:
                pass

            # Verify that we actually extracted some data
            extracted_fields = [data['address'], data['rating'],
                              data['latitude'], data['phone'], data['website']]
            if not any(extracted_fields):
                # Nothing was extracted - something went wrong
                logging.error(f"✗ No data extracted for {name} - all fields empty!")
                data['status'] = 'error: no data extracted'
                raise Exception(f"Failed to extract any data for {name}. Check if cookie popup was handled or if page structure changed.")

            logging.info(f"✓ Successfully harvested: {name}")

        except Exception as e:
            logging.error(f"✗ Error processing {name}: {str(e)}")
            data['status'] = f'error: {str(e)}'
            raise  # Re-raise to stop the script

        return data

    def process_csv(self, input_file, output_file):
        """Process the entire CSV file"""
        results = []

        # Load existing tags before processing
        self._load_existing_tags(output_file)

        # Read input CSV (support both comma and semicolon delimiters)
        with open(input_file, 'r', encoding='utf-8') as f:
            # Detect delimiter by reading first line
            first_line = f.readline()
            f.seek(0)  # Reset to beginning

            # Use semicolon if it appears more than comma in header
            delimiter = ';' if first_line.count(';') > first_line.count(',') else ','

            reader = csv.DictReader(f, delimiter=delimiter)
            restaurants = list(reader)

        total = len(restaurants)
        logging.info(f"Found {total} restaurants to process")

        # Process each restaurant
        for idx, row in enumerate(restaurants, 1):
            name = row.get('Title', '').strip()
            url = row.get('URL', '').strip()

            if not name or not url:
                logging.warning(f"Skipping row {idx}: missing name or URL")
                continue

            logging.info(f"[{idx}/{total}] Processing: {name}")

            data = self.harvest_restaurant(name, url)

            results.append(data)

            # Save after each restaurant (safer in case of crashes)
            self._save_results(results, output_file)
            logging.info(f"Progress saved: {idx}/{total}")

            # Be nice to Google - add delay between requests
            time.sleep(2)

        # Final save
        self._save_results(results, output_file)
        logging.info(f"Complete! Processed {len(results)} restaurants")

        return results

    def _save_results(self, results, output_file):
        """Save results to CSV"""
        if not results:
            return

        fieldnames = ['name', 'food_tags', 'mood_tags', 'address', 'neighborhood',
                     'latitude', 'longitude', 'rating', 'reviews_count', 'price_level',
                     'phone', 'website', 'hours', 'permanently_closed', 'temporarily_closed',
                     'maps url', 'status']

        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)

    def close(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()

def main():
    import sys

    # Allow specifying input file as command-line argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        input_file = 'Favorite places.csv'  # Default

    # Create output filename based on input filename
    base_name = input_file.replace('.csv', '')
    output_file = f'{base_name}_enriched.csv'

    logging.info("Starting Restaurant Harvester")
    logging.info(f"Input: {input_file}")
    logging.info(f"Output: {output_file}")

    harvester = RestaurantHarvester(headless=True)

    try:
        results = harvester.process_csv(input_file, output_file)
        logging.info(f"Successfully processed {len(results)} restaurants")
        logging.info(f"Results saved to {output_file}")
    except Exception as e:
        logging.error(f"Fatal error: {str(e)}")
        raise
    finally:
        harvester.close()

if __name__ == '__main__':
    main()
