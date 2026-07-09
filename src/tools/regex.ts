// Regex Tester

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  namedGroups: Record<string, string>;
  fullMatch: string; // full match text with surrounding context (for highlighting)
  start: number;
  end: number;
}

export interface RegexTestResult {
  ok: boolean;
  error?: string;
  matches: RegexMatch[];
  totalMatches: number;
  flags: string[];
  executionTimeMs: number;
}

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
  const start = performance.now();
  if (!pattern) {
    return { ok: false, error: 'Pattern is empty', matches: [], totalMatches: 0, flags: [], executionTimeMs: 0 };
  }
  try {
    const re = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    // Reset lastIndex to allow re-runs
    re.lastIndex = 0;
    while ((m = re.exec(input)) !== null) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
        namedGroups: { ...(m.groups ?? {}) },
        fullMatch: input.substring(m.index, m.index + m[0].length),
        start: m.index,
        end: m.index + m[0].length,
      });
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      if (!flags.includes('g')) break;
    }
    return {
      ok: true,
      matches,
      totalMatches: matches.length,
      flags: flags.split(''),
      executionTimeMs: Math.round((performance.now() - start) * 100) / 100,
    };
  } catch (err) {
    return {
      ok: false,
      error: (err as Error).message,
      matches: [],
      totalMatches: 0,
      flags: [],
      executionTimeMs: 0,
    };
  }
}

export function highlightMatches(input: string, matches: RegexMatch[]): string {
  if (matches.length === 0) return escapeHtml(input);

  // Build segments: non-match / match / non-match / ...
  type Seg = { text: string; matched: boolean };
  const segments: Seg[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) {
      segments.push({ text: input.substring(cursor, m.start), matched: false });
    }
    segments.push({ text: input.substring(m.start, m.end), matched: true });
    cursor = m.end;
  }
  if (cursor < input.length) {
    segments.push({ text: input.substring(cursor), matched: false });
  }

  return segments
    .map((seg) => {
      const safe = escapeHtml(seg.text);
      return seg.matched ? `<mark class="bg-yellow-200 dark:bg-yellow-500/40 dark:text-yellow-50 rounded px-0.5">${safe}</mark>` : safe;
    })
    .join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
