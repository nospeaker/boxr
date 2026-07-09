// Case Converter utilities

export type CaseStyle =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'SCREAMING_SNAKE_CASE'
  | 'CONSTANT_CASE'
  | 'lowercase'
  | 'UPPERCASE'
  | 'Title Case'
  | 'Sentence case'
  | 'dot.case'
  | 'space case';

const SEPARATOR_RE = /[_\-\s\.\/\\]+|(?=[A-Z][a-z])|(?<=[a-z])(?=[A-Z])/g;

export function splitWords(input: string): string[] {
  if (!input.trim()) return [];
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(SEPARATOR_RE)
    .map((w) => w.trim())
    .filter(Boolean);
}

export function toCase(input: string, style: CaseStyle): string {
  const words = splitWords(input);
  if (words.length === 0) return '';

  switch (style) {
    case 'camelCase':
      return words
        .map((w, i) =>
          i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    case 'PascalCase':
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake_case':
    case 'CONSTANT_CASE':
    case 'SCREAMING_SNAKE_CASE':
    case 'kebab-case':
    case 'dot.case':
    case 'space case': {
      const sep =
        style === 'snake_case'
          ? '_'
          : style === 'kebab-case'
          ? '-'
          : style === 'dot.case'
          ? '.'
          : style === 'space case'
          ? ' '
          : '_';
      const joined = words.map((w) => w.toLowerCase()).join(sep);
      return style === 'SCREAMING_SNAKE_CASE' || style === 'CONSTANT_CASE' ? joined.toUpperCase() : joined;
    }
    case 'lowercase':
      return input.replace(/\s+/g, '').toLowerCase();
    case 'UPPERCASE':
      return input.replace(/\s+/g, '').toUpperCase();
    case 'Title Case':
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    case 'Sentence case':
      if (words.length === 0) return '';
      const first = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
      const rest = words.slice(1).map((w) => w.toLowerCase()).join(' ');
      return rest ? `${first} ${rest}` : first;
    default:
      return input;
  }
}

export const ALL_CASES: CaseStyle[] = [
  'camelCase',
  'PascalCase',
  'snake_case',
  'kebab-case',
  'CONSTANT_CASE',
  'dot.case',
  'Title Case',
  'Sentence case',
  'UPPERCASE',
  'lowercase',
];
