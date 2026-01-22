import enrichedCsv from '../../Fastelavnsbolle_enriched.csv?raw';
import { parseCsv } from '@/lib/csv';

export interface Bakery {
  name: string;
  address: string;
  neighbourhood: string;
  foodTags: string[];
  moodTags: string[];
  rating: number | null;
  reviewsCount: number | null;
  url: string;
  website: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  temporarilyClosed: boolean;
}

// Map postal codes to neighbourhood names based on official Danish postal code directory
// København K (1000-1499) = Indre By/Christianshavn
// København V (1500-1799) = Vesterbro/City center
// Frederiksberg C (1800-1999) = Frederiksberg
// Frederiksberg (2000) = Frederiksberg
// København Ø (2100) = Østerbro
// København N (2200) = Nørrebro
// København S (2300) = Amager
// København NV (2400) = Nordvest
// København SV (2450) = Sydhavn
// Valby (2500) = Valby
const postalCodeToNeighbourhood: Record<string, string> = {
  // København K - Indre By
  '1000': 'Indre By',
  '1050': 'Indre By',
  '1100': 'Indre By',
  '1150': 'Indre By',
  '1200': 'Indre By',
  '1250': 'Indre By',
  '1260': 'Indre By',
  '1300': 'Indre By',
  '1350': 'Indre By',
  '1366': 'Indre By',
  // København K - Christianshavn
  '1400': 'Christianshavn',
  '1401': 'Christianshavn',
  '1402': 'Christianshavn',
  '1403': 'Christianshavn',
  '1404': 'Christianshavn',
  '1405': 'Christianshavn',
  '1406': 'Christianshavn',
  '1407': 'Christianshavn',
  '1408': 'Christianshavn',
  '1409': 'Christianshavn',
  '1410': 'Christianshavn',
  '1411': 'Christianshavn',
  '1412': 'Christianshavn',
  '1413': 'Christianshavn',
  '1414': 'Christianshavn',
  '1415': 'Christianshavn',
  '1416': 'Christianshavn',
  '1417': 'Christianshavn',
  '1418': 'Christianshavn',
  '1419': 'Christianshavn',
  '1420': 'Christianshavn',
  '1421': 'Christianshavn',
  '1422': 'Christianshavn',
  '1423': 'Christianshavn',
  '1424': 'Christianshavn',
  '1425': 'Christianshavn',
  '1426': 'Christianshavn',
  '1427': 'Christianshavn',
  '1428': 'Christianshavn',
  '1429': 'Christianshavn',
  '1430': 'Christianshavn',
  '1431': 'Christianshavn',
  // København K - Refshaleøen (part of Christianshavn area)
  '1432': 'Refshaleøen',
  '1433': 'Refshaleøen',
  // København K - continued
  '1434': 'Christianshavn',
  '1435': 'Christianshavn',
  '1436': 'Christianshavn',
  '1437': 'Christianshavn',
  '1438': 'Christianshavn',
  '1439': 'Christianshavn',
  '1440': 'Christianshavn',
  '1441': 'Christianshavn',
  '1450': 'Indre By',
  '1500': 'Indre By',
  '1550': 'Indre By',
  // København V - Vesterbro
  '1600': 'Vesterbro',
  '1620': 'Vesterbro',
  '1650': 'Vesterbro',
  '1700': 'Vesterbro',
  '1704': 'Vesterbro',
  '1750': 'Vesterbro',
  '1799': 'Vesterbro',
  // Frederiksberg C
  '1800': 'Frederiksberg',
  '1850': 'Frederiksberg',
  '1879': 'Frederiksberg',
  '1900': 'Frederiksberg',
  // Frederiksberg
  '2000': 'Frederiksberg',
  // København Ø - Østerbro
  '2100': 'Østerbro',
  // Nordhavn
  '2150': 'Nordhavn',
  // København N - Nørrebro
  '2200': 'Nørrebro',
  // København S - Amager
  '2300': 'Amager',
  // København NV - Nordvest
  '2400': 'Nordvest',
  // København SV - Sydhavn
  '2450': 'Sydhavn',
  // Valby
  '2500': 'Valby',
};

function extractNeighbourhood(address: string): string {
  // Extract postal code from address (Danish format: "Street, XXXX City")
  const match = address.match(/(\d{4})\s+/);
  if (match) {
    const postalCode = match[1];
    return postalCodeToNeighbourhood[postalCode] || 'København';
  }
  return 'København';
}

function parseReviewsCount(reviews: string): number | null {
  if (!reviews) return null;
  // Handle comma-formatted numbers like "1,003"
  const cleaned = reviews.replace(/,/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

function parseRating(rating: string): number | null {
  if (!rating) return null;
  const num = parseFloat(rating);
  return isNaN(num) ? null : num;
}

function toNumberOrNull(value: string): number | null {
  const trimmed = (value ?? '').toString().trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function rowToRecord(headers: string[], row: string[]) {
  const record: Record<string, string> = {};
  for (let i = 0; i < headers.length; i++) {
    record[headers[i]] = row[i] ?? '';
  }
  return record;
}

function splitTags(value: string): string[] {
  return (value ?? '')
    .split(/[;,]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function isNo(value: string) {
  const v = (value ?? '').trim().toLowerCase();
  return v === '' || v === 'no' || v === 'false' || v === '0';
}

// Source of truth: Fastelavnsbolle_enriched.csv
export const bakeries: Bakery[] = (() => {
  // The CSV file uses semicolons as delimiters
  const rows = parseCsv(enrichedCsv, ';');
  if (rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  // Expect columns like:
  // name,address,neighborhood,latitude,longitude,rating,reviews_count,phone,website,maps_url,permanently_closed,temporarily_closed,status
  return dataRows
    .map((r) => rowToRecord(headers, r))
    .filter((r) => (r.name ?? '').trim() !== '')
     // Hide permanently closed places, but keep temporarily closed ones (shown as muted in UI)
     .filter((r) => isNo(r.permanently_closed))
    .filter((r) => (r.status ?? '').trim() === '' || (r.status ?? '').trim().toLowerCase() === 'success')
    .map((r) => {
      const address = (r.address ?? '').trim();
      // Support both US/UK spellings and some common variants from the CSV
      const neighbourhoodFromCsv = (
        r.neighborhood ??
        r.neighbourhood ??
        r.neighbourhoods ??
        r.neighborhoods ??
        ''
      ).trim();

      const neighbourhood = neighbourhoodFromCsv || extractNeighbourhood(address);

      const url = (r['maps_url'] ?? r['maps url'] ?? r['maps_url'] ?? '').trim();

      const foodTags = splitTags(r.food_tags ?? r.food_tag ?? '');
      const moodTags = splitTags(r.mood_tags ?? r.mood_tag ?? '');

       const temporarilyClosed = !isNo(r.temporarily_closed ?? '');

      return {
        name: (r.name ?? '').trim(),
        address,
        neighbourhood,
        foodTags,
        moodTags,
        rating: parseRating((r.rating ?? '').trim()),
        reviewsCount: parseReviewsCount((r.reviews_count ?? '').trim()),
        url,
        website: (r.website ?? '').trim() || null,
        phone: (r.phone ?? '').trim() || null,
        latitude: toNumberOrNull(r.latitude ?? ''),
        longitude: toNumberOrNull(r.longitude ?? ''),
         temporarilyClosed,
      } satisfies Bakery;
    })
    // If a row doesn't have a maps url, keep it out (otherwise clicking breaks)
    .filter((b) => b.url.trim() !== '');
})();