import enrichedCsv from '../../Fastelavnsbolle_enriched.csv?raw';
import { parseCsv } from '@/lib/csv';
import { bakeries } from '@/data/bakeries';

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

function uniqueSorted(values: Iterable<string>): string[] {
  return Array.from(new Set(Array.from(values).map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
}

// Source of truth: Fastelavnsbolle_enriched.csv
export const foodTags: string[] = (() => {
  const rows = parseCsv(enrichedCsv);
  if (rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  const tags: string[] = [];
  for (const r of dataRows) {
    const record = rowToRecord(headers, r);
    tags.push(...splitTags(record.food_tags ?? record.food_tag ?? ''));
  }
  return uniqueSorted(tags);
})();

export const moodTags: string[] = (() => {
  const rows = parseCsv(enrichedCsv);
  if (rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  const tags: string[] = [];
  for (const r of dataRows) {
    const record = rowToRecord(headers, r);
    tags.push(...splitTags(record.mood_tags ?? record.mood_tag ?? ''));
  }
  return uniqueSorted(tags);
})();

// Neighbourhoods as shown in the UI (derived from our existing parsing + postal code mapping)
export const hoodTags: string[] = uniqueSorted(bakeries.map((b) => b.neighbourhood));
