// JSON to CSV Converter

export interface CsvResult {
  text: string;
  error?: string;
  rowCount: number;
  columnCount: number;
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function jsonToCSV(input: string, options: { delimiter: string; flattenNested: boolean } = { delimiter: ',', flattenNested: false }): CsvResult {
  if (!input.trim()) return { text: '', rowCount: 0, columnCount: 0 };
  try {
    const parsed = JSON.parse(input);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    if (rows.length === 0) return { text: '', rowCount: 0, columnCount: 0 };

    // Collect all keys (union of all row keys, in first-seen order, with optional flat)
    const keySet = new Set<string>();
    rows.forEach((row) => collectKeys(row, '', keySet, options.flattenNested));
    const keys = Array.from(keySet);

    const lines: string[] = [];
    lines.push(keys.map(escapeCsv).join(options.delimiter));
    rows.forEach((row) => {
      const values = keys.map((k) => {
        const v = getValue(row, k, options.flattenNested);
        return escapeCsv(v);
      });
      lines.push(values.join(options.delimiter));
    });

    const text = lines.join('\r\n');
    return { text, rowCount: rows.length, columnCount: keys.length };
  } catch (err) {
    return { text: '', rowCount: 0, columnCount: 0, error: (err as Error).message };
  }
}

function collectKeys(row: unknown, prefix: string, out: Set<string>, flatten: boolean) {
  if (Array.isArray(row)) {
    row.forEach((item, i) => collectKeys(item, `${prefix}[${i}]`, out, flatten));
    return;
  }
  if (row !== null && typeof row === 'object') {
    for (const key of Object.keys(row)) {
      const fullKey = prefix ? `${prefix}${flatten ? '.' : '.'}${key}` : key;
      const value = (row as Record<string, unknown>)[key];
      if (flatten && value !== null && typeof value === 'object' && !Array.isArray(value)) {
        collectKeys(value, fullKey, out, flatten);
      } else if (flatten && Array.isArray(value) && value.every((v) => v === null || typeof v !== 'object')) {
        out.add(fullKey);
      } else {
        out.add(prefix ? `${prefix}.${key}` : key);
      }
    }
    return;
  }
  // primitive at top level — skip
}

function getValue(row: unknown, dottedKey: string, flatten: boolean): unknown {
  if (!dottedKey.includes('.')) {
    return (row as Record<string, unknown> | undefined)?.[dottedKey];
  }
  const parts = dottedKey.split('.');
  let cur: unknown = row;
  for (const p of parts) {
    if (Array.isArray(cur)) {
      const idx = parseInt(p.replace(/\D/g, ''), 10);
      cur = cur[Number.isFinite(idx) ? idx : 0];
    } else if (cur !== null && typeof cur === 'object') {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  if (Array.isArray(cur) && flatten) {
    return cur.join(', ');
  }
  return cur;
}
