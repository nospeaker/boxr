// JSON Formatter & Validator

export interface FormatOptions {
  indent: 2 | 4 | 'tab';
  sortKeys: boolean;
}

export interface FormatResult {
  text: string;
  error?: string;
  isValid: boolean;
  sizeBytes: number;
  lineCount: number;
}

const computeStats = (text: string) => ({
  sizeBytes: new Blob([text]).size,
  lineCount: text.split('\n').length,
});

export function formatJSON(input: string, options: FormatOptions): FormatResult {
  if (!input.trim()) {
    return { text: '', isValid: true, sizeBytes: 0, lineCount: 0 };
  }

  try {
    const parsed: unknown = JSON.parse(input);
    const indentValue = options.indent === 'tab' ? '\t' : Number(options.indent);
    let normalized = JSON.stringify(parsed, null, indentValue);
    if (options.sortKeys) {
      normalized = sortKeysDeep(parsed, indentValue);
    }
    return { text: normalized, isValid: true, ...computeStats(normalized) };
  } catch (err) {
    return {
      text: '',
      isValid: false,
      error: (err as Error).message,
      sizeBytes: 0,
      lineCount: 0,
    };
  }
}

export function minifyJSON(input: string): FormatResult {
  if (!input.trim()) {
    return { text: '', isValid: true, sizeBytes: 0, lineCount: 0 };
  }
  try {
    const parsed: unknown = JSON.parse(input);
    const text = JSON.stringify(parsed);
    return { text, isValid: true, ...computeStats(text) };
  } catch (err) {
    return { text: '', isValid: false, error: (err as Error).message, sizeBytes: 0, lineCount: 0 };
  }
}

function sortKeysDeep(value: unknown, indent: string | number): string {
  if (Array.isArray(value)) {
    const items = value.map((v) => sortKeysDeep(v, indent)).join(',' + (indent === '\t' ? '\t' : '\n'));
    if (!items) return '[]';
    const sep = indent === '\t' ? '\t' : '\n';
    return '[' + sep + indentForDepth(indent) + items + sep + ']';
  }
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    if (keys.length === 0) return '{}';
    const inner = keys
      .map((k) => JSON.stringify(k) + ': ' + sortKeysDeep(obj[k], indent))
      .join(',' + (indent === '\t' ? ' ' : '\n'));
    const sep = indent === '\t' ? ' ' : '\n';
    return '{' + sep + indentForDepth(indent) + inner + sep + '}';
  }
  return JSON.stringify(value);
}

function indentForDepth(indent: string | number): string {
  return typeof indent === 'string' ? indent : ' '.repeat(indent);
}

export function validateJSON(input: string): { ok: boolean; error?: string } {
  if (!input.trim()) return { ok: true };
  try {
    JSON.parse(input);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
