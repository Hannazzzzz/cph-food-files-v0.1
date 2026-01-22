// Minimal CSV parser that supports:
// - quoted fields
// - escaped quotes ("")
// - newlines inside quoted fields
//
// Returns rows of raw string fields (no type conversion).
export function parseCsv(csvText: string): string[][] {
  const rows: string[][] = [];

  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };

  const pushRow = () => {
    // Avoid emitting a final empty row if the file ends with a newline.
    if (row.length === 1 && row[0] === '' && rows.length > 0) return;
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (inQuotes) {
      if (char === '"') {
        const next = csvText[i + 1];
        if (next === '"') {
          field += '"';
          i++; // consume escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      pushField();
      continue;
    }

    if (char === '\n') {
      pushField();
      pushRow();
      continue;
    }

    if (char === '\r') {
      // Ignore CR; LF handles line breaks.
      continue;
    }

    field += char;
  }

  // Final field + row
  pushField();
  if (row.length > 1 || row[0] !== '') pushRow();

  return rows;
}
