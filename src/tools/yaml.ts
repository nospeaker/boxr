// JSON <-> YAML minimal converters (browser-friendly, no deps)

// Minimal safe YAML serializer with proper indentation and string quoting.
export function jsonToYAML(input: string, indent = 2): { text: string; error?: string } {
  if (!input.trim()) return { text: '' };
  try {
    const value = JSON.parse(input);
    return { text: dumpYaml(value, 0, indent) };
  } catch (err) {
    return { text: '', error: (err as Error).message };
  }
}

export function yamlToJson(input: string): { text: string; error?: string } {
  if (!input.trim()) return { text: '' };
  try {
    const value = parseYaml(input);
    return { text: JSON.stringify(value, null, 2) };
  } catch (err) {
    return { text: '', error: (err as Error).message };
  }
}

const NEEDS_QUOTE = /[:#\-?\[\]\{\},&*!|>'"%@`]|^\s|\s$|^[0-9]+$|^-$|^(true|false|null|~)$/i;

function dumpYaml(value: unknown, depth: number, indent: number): string {
  const pad = ' '.repeat(indent * depth);
  const padInner = ' '.repeat(indent * (depth + 1));
  const sp = ' '.repeat(indent);

  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return quoteString(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((item) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          // Use special "first key at same line" syntax
          const entries = Object.entries(item as Record<string, unknown>);
          if (entries.length === 0) return `${pad}{}`;
          const [firstKey, firstVal] = entries[0];
          const firstRendered = dumpYaml(firstVal, 0, indent);
          const restRendered = entries
            .slice(1)
            .map(([k, v]) => `${padInner}${k}: ${formatInline(v, indent)}`.trimEnd())
            .join('\n');
          return restRendered
            ? `${pad}${firstKey}: ${firstRendered}\n${restRendered}`
            : `${pad}${firstKey}: ${firstRendered}`;
        }
        const rendered = dumpYaml(item, 0, indent);
        // Allow short array items on same line
        if (rendered.includes('\n')) {
          // Multi-line — put on its own line with indent
          return `${pad}-\n${rendered.split('\n').map((l, i) => (i === 0 ? `${pad}${sp}${l}` : l)).join('\n')}`;
        }
        return `${pad}- ${rendered}`;
      })
      .join('\n');
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries
      .map(([k, v]) => {
        if (v !== null && (typeof v === 'object')) {
          const inner = dumpYaml(v, depth + 1, indent);
          return `${pad}${k}:\n${inner}`;
        }
        return `${pad}${k}: ${formatInline(v, indent)}`;
      })
      .join('\n');
  }
  return String(value);
}

function formatInline(v: unknown, indent: number): string {
  return dumpYaml(v, 0, indent);
}

function quoteString(s: string): string {
  if (s === '') return "''";
  if (!NEEDS_QUOTE.test(s)) return s;
  // Use single-quoted style (with '' escaping)
  return "'" + s.replace(/'/g, "''") + "'";
}

// ────────────── Minimal YAML parser (subset: maps, sequences, scalars) ──────────────

class YamlParseError extends Error {}

export function parseYaml(input: string): unknown {
  const lines = input
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((l) => !/^\s*#/.test(l) && l.trim() !== '');
  const state: { indent: number; value: unknown; type: 'map' | 'seq'; parent: any }[] = [
    { indent: -1, value: null, type: 'map', parent: null },
  ];

  for (const raw of lines) {
    const indent = raw.match(/^\s*/)![0].length;
    const line = raw.trimStart();

    // Pop stack to current indent level
    while (state.length > 1 && state[state.length - 1].indent >= indent) state.pop();
    const top = state[state.length - 1];
    if (top.indent !== -1 && indent <= top.indent) {
      throw new YamlParseError(`Unexpected indent at line: ${raw}`);
    }

    if (line.startsWith('- ')) {
      const item = parseScalar(line.slice(2));
      attachSequenceItem(top, item);
      // Push a new context so children attach into this map
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        state.push({ indent: line.match(/^\s*/)![0].length + 2, value: item, type: 'map', parent: top.value });
      } else if (item !== null && Array.isArray(item)) {
        state.push({ indent: line.match(/^\s*/)![0].length + 2, value: item, type: 'seq', parent: top.value });
      }
      continue;
    }

    if (line.startsWith('-')) {
      attachSequenceItem(top, parseScalar(line.slice(1).trim()));
      continue;
    }

    const m = line.match(/^([^:#]+):\s*(.*)$/);
    if (!m) throw new YamlParseError(`Cannot parse line: ${raw}`);
    const key = m[1].trim();
    const raw2 = m[2].trim();
    if (raw2 === '') {
      // Open a new container
      const newMap: Record<string, unknown> = {};
      const newSeq: unknown[] = [];
      // Decide based on next line — defer by treating as map for now (safer default)
      attachMapKey(top, key, newMap);
      state.push({ indent, value: newMap, type: 'map', parent: top.value });
      void newSeq;
    } else {
      const value = parseScalar(raw2);
      attachMapKey(top, key, value);
      if (value !== null && typeof value === 'object') {
        state.push({ indent, value, type: Array.isArray(value) ? 'seq' : 'map', parent: top.value });
      }
    }
  }
  return state[0].parent ?? state[0].value;
}

function attachSequenceItem(top: { value: unknown; type: string }, item: unknown) {
  if (!Array.isArray(top.value)) {
    // Treat as implicit sequence
    throw new YamlParseError('Expected sequence but found map');
  }
  top.value.push(item);
}

function attachMapKey(top: { value: unknown; type: string }, key: string, value: unknown) {
  if (top.value === null) top.value = {};
  if (Array.isArray(top.value)) {
    // Last item of array — if last is map, insert into it
    const last = top.value[top.value.length - 1];
    if (last && typeof last === 'object' && !Array.isArray(last)) {
      (last as Record<string, unknown>)[key] = value;
      return;
    }
  }
  if (typeof top.value !== 'object' || top.value === null) {
    throw new YamlParseError('Cannot attach key to non-map');
  }
  (top.value as Record<string, unknown>)[key] = value;
}

function parseScalar(s: string): unknown {
  if (s === '' || s === '~' || s.toLowerCase() === 'null') return null;
  if (s === 'true' || s.toLowerCase() === 'yes' || s === 'on') return true;
  if (s === 'false' || s.toLowerCase() === 'no' || s === 'off') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  // Strip surrounding quotes
  if (s.startsWith("'") && s.endsWith("'")) {
    return s.slice(1, -1).replace(/''/g, "'");
  }
  if (s.startsWith('"') && s.endsWith('"')) {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }
  // Inline flow
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((x) => parseScalar(x.trim()));
  }
  if (s.startsWith('{') && s.endsWith('}')) {
    const inner = s.slice(1, -1).trim();
    const obj: Record<string, unknown> = {};
    if (!inner) return obj;
    // very simple flow map: key: value pairs
    const pairs = splitFlowPairs(inner);
    for (const pair of pairs) {
      const idx = pair.indexOf(':');
      if (idx < 0) continue;
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      obj[k] = parseScalar(v);
    }
    return obj;
  }
  return s;
}

function splitFlowPairs(s: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let inStr = false;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'" || ch === '"') {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') depth--;
    else if (ch === ',' && depth === 0) {
      result.push(s.slice(start, i));
      start = i + 1;
    }
  }
  if (start < s.length) result.push(s.slice(start));
  return result;
}
