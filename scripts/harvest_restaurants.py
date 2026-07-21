#!/usr/bin/env python3
"""
Restaurant Data Harvester (v2, hardened)

Reads a CSV of places (Google Takeout export or a previous enriched CSV),
visits each Google Maps link and writes an enriched CSV with address,
coordinates, rating, opening status, closure flags, etc.

Design principles:
- One bad restaurant never kills the run (recorded as error, run continues).
- Aborts early only if the FIRST 3 places all fail (systemic problem,
  e.g. consent wall or changed page structure).
- Input reading is BOM-proof and delimiter-agnostic (comma or semicolon).
- Manual food_tags/mood_tags are preserved across runs, keyed by Google
  place ID (not name), so duplicate names and renames are safe.
- Google Maps is forced to English (hl=en) so text selectors are stable.
- Output is always comma-delimited UTF-8 (what the website expects).
"""

import csv
import os
import re
import sys
import time
import logging
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('harvest.log'), logging.StreamHandler()],
)

OUTPUT_FIELDS = [
    'name', 'food_tags', 'mood_tags', 'address', 'neighborhood',
    'latitude', 'longitude', 'rating', 'reviews_count', 'price_level',
    'phone', 'website', 'hours', 'permanently_closed', 'temporarily_closed',
    'maps url', 'status',
]

# Copenhagen postal code to neighborhood mapping (most specific first)
POSTAL_CODE_NEIGHBORHOODS = [
    (range(1432, 1434), "Refshaleøen"),
    (range(1434, 1442), "Holmen"),
    (range(1000, 1500), "Indre By"),
    (range(1500, 1800), "Vesterbro"),
    (range(1800, 2001), "Frederiksberg"),
    (range(2100, 2101), "Østerbro"),
    (range(2150, 2151), "Nordhavn"),
    (range(2200, 2201), "Nørrebro"),
    (range(2300, 2301), "Amager"),
    (range(2400, 2401), "Nordvest"),
    (range(2450, 2451), "Sydhavn"),
    (range(2500, 2501), "Valby"),
    (range(2600, 2601), "Glostrup"),
    (range(2605, 2606), "Brøndby"),
    (range(2610, 2611), "Rødovre"),
    (range(2620, 2621), "Albertslund"),
    (range(2625, 2626), "Vallensbæk"),
    (range(2630, 2631), "Taastrup"),
    (range(2635, 2636), "Ishøj"),
    (range(2640, 2641), "Hedehusene"),
    (range(2650, 2651), "Hvidovre"),
    (range(2660, 2661), "Brøndby Strand"),
    (range(2665, 2666), "Vallensbæk Strand"),
    (range(2670, 2671), "Greve"),
    (range(2680, 2681), "Solrød Strand"),
    (range(2690, 2691), "Karlslunde"),
    (range(2700, 2701), "Brønshøj"),
    (range(2720, 2721), "Vanløse"),
    (range(2730, 2731), "Herlev"),
    (range(2740, 2741), "Skovlunde"),
    (range(2750, 2751), "Ballerup"),
    (range(2760, 2761), "Måløv"),
    (range(2765, 2766), "Smørum"),
    (range(2770, 2771), "Kastrup"),
    (range(2791, 2792), "Dragør"),
    (range(2800, 2801), "Kongens Lyngby"),
    (range(2820, 2821), "Gentofte"),
    (range(2830, 2831), "Virum"),
    (range(2840, 2841), "Holte"),
    (range(2850, 2851), "Nærum"),
    (range(2860, 2861), "Søborg"),
    (range(2870, 2871), "Dyssegård"),
    (range(2880, 2881), "Bagsværd"),
    (range(2900, 2901), "Hellerup"),
    (range(2920, 2921), "Charlottenlund"),
    (range(2930, 2931), "Klampenborg"),
]

# ---------------------------------------------------------------------------
# Pure helper functions (unit-testable without a browser)
# ---------------------------------------------------------------------------

def sniff_delimiter(first_line):
    """Choose ';' or ',' based on which occurs more in the header line."""
    return ';' if first_line.count(';') > first_line.count(',') else ','


def read_places_csv(path):
    """Read any of our CSV shapes (Takeout or enriched) into a list of dicts.

    BOM-proof (utf-8-sig) and delimiter-agnostic. Header keys are stripped.
    """
    with open(path, 'r', encoding='utf-8-sig', newline='') as f:
        first_line = f.readline()
        f.seek(0)
        delimiter = sniff_delimiter(first_line)
        reader = csv.DictReader(f, delimiter=delimiter)
        rows = []
        for row in reader:
            clean = { (k or '').strip(): (v or '').strip() for k, v in row.items() if k is not None }
            rows.append(clean)
        return rows


def get_name_and_url(row):
    """Extract place name and maps URL from a row, whatever the CSV shape."""
    lower = {k.lower(): v for k, v in row.items()}
    name = lower.get('title') or lower.get('name') or ''
    url = lower.get('url') or lower.get('maps url') or lower.get('maps_url') or ''
    return name.strip(), url.strip()


def extract_place_id(url):
    """Extract the stable Google place ID (0x..:0x..) from a maps URL."""
    match = re.search(r'1s(0x[0-9a-f]+:0x[0-9a-f]+)', url or '')
    return match.group(1) if match else None


def force_english(url):
    """Append hl=en&gl=DK to a Google Maps URL so the UI language is stable."""
    if not url:
        return url
    parsed = urlparse(url)
    query = parse_qs(parsed.query)
    query['hl'] = ['en']
    query['gl'] = ['DK']
    return urlunparse(parsed._replace(query=urlencode(query, doseq=True)))


def extract_postal_code(address):
    if not address:
        return None
    match = re.search(r'\b(\d{4})\b', address)
    return int(match.group(1)) if match else None


def get_neighborhood(postal_code):
    if not postal_code:
        return ""
    for postal_range, neighborhood in POSTAL_CODE_NEIGHBORHOODS:
        if postal_code in postal_range:
            return neighborhood
    return ""


def detect_closure(header_texts):
    """Detect closure from the texts near the place title (not whole page).

    Returns (permanently_closed, temporarily_closed) as 'Yes'/'No'.
    Handles English and Danish UI strings as a safety net.
    """
    perm_markers = ['permanently closed', 'permanent lukket']
    temp_markers = ['temporarily closed', 'midlertidigt lukket']
    perm, temp = 'No', 'No'
    for text in header_texts:
        t = (text or '').strip().lower()
        if any(m in t for m in perm_markers):
            perm = 'Yes'
        if any(m in t for m in temp_markers):
            temp = 'Yes'
    return perm, temp


def load_existing_tags(path):
    """Load manual tags from a previous enriched CSV.

    Keyed by place ID when available (robust against renames and duplicate
    names), with name as fallback key.
    """
    tags = {}
    if not path or not os.path.exists(path):
        logging.info("No existing output file found - all tags start empty")
        return tags
    try:
        for row in read_places_csv(path):
            name, url = get_name_and_url(row)
            food = row.get('food_tags', '')
            mood = row.get('mood_tags', '')
            if not (food or mood):
                continue
            entry = {'food_tags': food, 'mood_tags': mood}
            place_id = extract_place_id(url)
            if place_id:
                tags[place_id] = entry
            if name:
                tags.setdefault(name, entry)
        logging.info(f"Loaded existing tags for {len(tags)} keys")
    except Exception as e:
        logging.warning(f"Could not load existing tags: {e}")
    return tags


def lookup_tags(tags, name, url):
    place_id = extract_place_id(url)
    if place_id and place_id in tags:
        return tags[place_id]
    return tags.get(name, {})


def dedupe_rows(rows):
    """Drop duplicate places (same URL, or same name when URL missing)."""
    seen, result = set(), []
    for row in rows:
        name, url = get_name_and_url(row)
        key = extract_place_id(url) or url or name
        if not key or key in seen:
            continue
        seen.add(key)
        result.append(row)
    return result

# ---------------------------------------------------------------------------
# Selenium harvester
# ---------------------------------------------------------------------------

class RestaurantHarvester:
    def __init__(self, headless=True):
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        from selenium.webdriver.support.ui import WebDriverWait

        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--lang=en-GB')
        chrome_options.add_argument(
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        try:
            from webdriver_manager.chrome import ChromeDriverManager
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
        except Exception:
            # Fall back to system chromedriver (e.g. installed via brew/apt)
            self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        self.consent_handled = False
        self.existing_tags = {}

    # -- page helpers -------------------------------------------------------

    def _find_text(self, selector):
        from selenium.webdriver.common.by import By
        try:
            return self.driver.find_element(By.CSS_SELECTOR, selector).text.strip()
        except Exception:
            return ""

    def _find_attr(self, selector, attribute):
        from selenium.webdriver.common.by import By
        try:
            el = self.driver.find_element(By.CSS_SELECTOR, selector)
            return (el.get_attribute(attribute) or "").strip()
        except Exception:
            return ""

    def _handle_consent(self):
        """Click through Google's cookie consent if present."""
        from selenium.webdriver.common.by import By
        if 'consent' not in self.driver.current_url and 'consent' not in self.driver.page_source[:2000].lower():
            return
        selectors = [
            (By.XPATH, "//button[contains(., 'Accept all')]"),
            (By.XPATH, "//button[contains(., 'Reject all')]"),
            (By.XPATH, "//button[@aria-label='Accept all']"),
            (By.CSS_SELECTOR, "form[action*='consent'] button"),
        ]
        for by, sel in selectors:
            try:
                self.driver.find_element(by, sel).click()
                logging.info("Clicked cookie consent button")
                time.sleep(2)
                self.consent_handled = True
                return
            except Exception:
                continue

    def _wait_for_place_page(self, timeout=12):
        """Wait until the place header (h1) is present."""
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support import expected_conditions as EC
        from selenium.webdriver.support.ui import WebDriverWait
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'h1')))
            return True
        except Exception:
            return False

    def _header_region_texts(self):
        """Collect texts from the place-header area used for closure detection."""
        from selenium.webdriver.common.by import By
        texts = []
        selectors = [
            'div.LBgpqf', 'div.lMbq3e',            # header block around title
            'span.fCEvvc',                          # closure banner chip
            'div.o0Svhf', 'div.F7nice',             # status / rating row
        ]
        for sel in selectors:
            try:
                for el in self.driver.find_elements(By.CSS_SELECTOR, sel):
                    if el.text:
                        texts.append(el.text)
            except Exception:
                continue
        # Fallback: aria-labels of the main region
        try:
            main = self.driver.find_element(By.CSS_SELECTOR, 'div[role="main"]')
            label = main.get_attribute('aria-label')
            if label:
                texts.append(label)
            # First ~40 lines of visible text in main region (header area)
            texts.append('\n'.join(main.text.split('\n')[:40]))
        except Exception:
            pass
        return texts

    def _extract_coordinates(self, max_retries=3):
        for attempt in range(max_retries):
            match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', self.driver.current_url)
            if match:
                return match.group(1), match.group(2)
            for pattern in (r'"latitude":(-?\d+\.\d+).*?"longitude":(-?\d+\.\d+)',
                            r'\[null,null,(-?\d{2}\.\d+),(-?\d{2}\.\d+)\]'):
                match = re.search(pattern, self.driver.page_source)
                if match:
                    return match.group(1), match.group(2)
            if attempt < max_retries - 1:
                time.sleep(2)
        logging.warning("Could not extract coordinates")
        return '', ''

    # -- main per-place logic ------------------------------------------------

    def harvest_restaurant(self, name, url):
        """Harvest one place. Never raises; sets data['status'] instead."""
        existing = lookup_tags(self.existing_tags, name, url)
        data = {f: '' for f in OUTPUT_FIELDS}
        data.update({
            'name': name,
            'maps url': url,
            'food_tags': existing.get('food_tags', ''),
            'mood_tags': existing.get('mood_tags', ''),
            'permanently_closed': 'No',
            'temporarily_closed': 'No',
            'status': 'success',
        })
        if existing:
            logging.info(f"  -> Preserving existing tags for {name}")

        try:
            self.driver.get(force_english(url))
            self._handle_consent()
            if not self._wait_for_place_page():
                raise RuntimeError("place page did not load (no h1)")
            time.sleep(1.5)  # allow dynamic content to settle

            # Closure flags (scoped to header area, EN + DA)
            perm, temp = detect_closure(self._header_region_texts())
            data['permanently_closed'] = perm
            data['temporarily_closed'] = temp

            data['rating'] = self._find_text('div.F7nice span[aria-hidden="true"]')
            reviews_text = self._find_attr('div.F7nice span[aria-label*="review"]', 'aria-label') \
                or self._find_text('div.F7nice span[aria-label*="review"]')
            m = re.search(r'[\d,.]+', reviews_text or '')
            data['reviews_count'] = m.group().rstrip('.,') if m else ''

            data['price_level'] = self._find_text('span[aria-label*="Price"]')

            address = self._find_attr('button[data-item-id="address"]', 'aria-label')
            data['address'] = re.sub(r'^Address:\s*', '', address or '')
            data['neighborhood'] = get_neighborhood(extract_postal_code(data['address']))

            data['latitude'], data['longitude'] = self._extract_coordinates()

            phone = self._find_attr('button[data-item-id*="phone"]', 'aria-label')
            data['phone'] = re.sub(r'^Phone:\s*', '', phone or '').replace('Copy phone number', '').strip()

            data['website'] = self._find_attr('a[data-item-id="authority"]', 'href')
            data['hours'] = self._find_text('div.o0Svhf span')

            # Permanently closed pages legitimately lack most fields
            if data['permanently_closed'] != 'Yes':
                core = [data['address'], data['rating'], data['latitude'],
                        data['phone'], data['website']]
                if not any(core):
                    raise RuntimeError(
                        "no data extracted - consent wall or page structure change?")
            logging.info(f"OK: {name}"
                         + (" [PERMANENTLY CLOSED]" if perm == 'Yes' else "")
                         + (" [temporarily closed]" if temp == 'Yes' else ""))
        except Exception as e:
            logging.error(f"FAIL: {name}: {e}")
            data['status'] = f'error: {e}'
        return data

    def process_csv(self, input_file, output_file, limit=None):
        self.existing_tags = load_existing_tags(output_file)

        rows = dedupe_rows(read_places_csv(input_file))
        if limit:
            rows = rows[:limit]
        total = len(rows)
        logging.info(f"Found {total} unique places to process")
        if total == 0:
            raise SystemExit("No usable rows found in input CSV - check the file format.")

        results, failures, first_three_failures = [], 0, 0
        for idx, row in enumerate(rows, 1):
            name, url = get_name_and_url(row)
            if not name or not url:
                logging.warning(f"Skipping row {idx}: missing name or URL")
                continue

            logging.info(f"[{idx}/{total}] {name}")
            data = self.harvest_restaurant(name, url)

            # Retry once on failure
            if data['status'] != 'success':
                logging.info(f"  retrying {name} ...")
                time.sleep(4)
                data = self.harvest_restaurant(name, url)

            # Tags provided in the *input* file win over everything
            if row.get('food_tags', '').strip():
                data['food_tags'] = row['food_tags'].strip()
            if row.get('mood_tags', '').strip():
                data['mood_tags'] = row['mood_tags'].strip()

            if data['status'] != 'success':
                failures += 1
                if idx <= 3:
                    first_three_failures += 1
            results.append(data)
            save_results(results, output_file)

            if idx == 3 and first_three_failures == 3:
                logging.error("First 3 places all failed - aborting (systemic problem). "
                              "Check harvest.log; likely a consent wall or Google page change.")
                break
            time.sleep(2)  # be polite to Google

        save_results(results, output_file)

        ok = sum(1 for r in results if r['status'] == 'success')
        perm = sum(1 for r in results if r['permanently_closed'] == 'Yes')
        temp = sum(1 for r in results if r['temporarily_closed'] == 'Yes')
        logging.info("=" * 50)
        logging.info(f"SUMMARY: {ok}/{len(results)} succeeded, {failures} failed, "
                     f"{perm} permanently closed, {temp} temporarily closed")
        if failures:
            failed_names = [r['name'] for r in results if r['status'] != 'success']
            logging.info("Failed: " + ", ".join(failed_names))
            logging.info("Re-run the same command to retry - successful data is kept, "
                         "manual tags are preserved.")
        logging.info("=" * 50)
        return results

    def close(self):
        if getattr(self, 'driver', None):
            self.driver.quit()


def save_results(results, output_file):
    if not results:
        return
    tmp = output_file + '.tmp'
    with open(tmp, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_FIELDS, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(results)
    os.replace(tmp, output_file)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = [a for a in sys.argv[1:] if a.startswith('--')]

    input_file = args[0] if args else 'Favorite places.csv'
    limit = None
    for flag in flags:
        if flag.startswith('--limit='):
            limit = int(flag.split('=')[1])

    if input_file.endswith('_enriched.csv'):
        output_file = input_file
    else:
        output_file = input_file.replace('.csv', '') + '_enriched.csv'

    logging.info("Starting Restaurant Harvester v2")
    logging.info(f"Input:  {os.path.abspath(input_file)}")
    logging.info(f"Output: {os.path.abspath(output_file)}")

    harvester = RestaurantHarvester(headless=True)
    try:
        harvester.process_csv(input_file, output_file, limit=limit)
    finally:
        harvester.close()


if __name__ == '__main__':
    main()
