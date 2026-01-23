import { bakeries } from '@/data/bakeries';

function uniqueSorted(values: Iterable<string>): string[] {
  return Array.from(new Set(Array.from(values).map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
}

// Source of truth: Favorite places_enriched.csv
// We derive tag options from the already CSV-parsed `bakeries` array to:
// - guarantee dropdowns never go empty if CSV parsing nuances change
// - avoid parsing the CSV multiple times
// - ensure tags always track the CSV content
export const foodTags: string[] = uniqueSorted(bakeries.flatMap((b) => b.foodTags));

export const moodTags: string[] = uniqueSorted(bakeries.flatMap((b) => b.moodTags));

// Neighbourhoods as shown in the UI (derived from our existing parsing + postal code mapping)
export const hoodTags: string[] = uniqueSorted(bakeries.map((b) => b.neighbourhood));
