import type { ToolCategory } from '~/consts';

export interface ToolConfig {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  category: ToolCategory;
  icon: string; // lucide icon name
  keywords: string[];
  publishedAt: string;
  featured?: boolean;
}

// Single source of truth for all tools.
// Add a new entry here, then create src/pages/tools/<slug>.astro and src/tools/<slug>.ts.
export const tools: ToolConfig[] = [
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, validate and beautify JSON data with syntax highlighting.',
    metaDescription:
      'Free online JSON formatter and validator. Pretty-print, minify, and validate JSON instantly in your browser. No data is sent to any server.',
    category: 'developer',
    icon: 'braces',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json pretty print'],
    publishedAt: '2026-07-08',
    featured: true,
  },
  {
    slug: 'json-to-csv',
    title: 'JSON to CSV Converter',
    description: 'Convert JSON arrays to CSV files — perfect for spreadsheets.',
    metaDescription:
      'Convert JSON to CSV online for free. Paste your JSON array and get a downloadable CSV file ready for Excel, Google Sheets, or any data tool.',
    category: 'developer',
    icon: 'file-spreadsheet',
    keywords: ['json to csv', 'json csv converter', 'json to excel'],
    publishedAt: '2026-07-08',
    featured: true,
  },
  {
    slug: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text between camelCase, snake_case, kebab-case, PascalCase, UPPERCASE and more.',
    metaDescription:
      'Free online case converter. Instantly transform text between camelCase, snake_case, kebab-case, PascalCase, UPPERCASE, lowercase, Title Case and more.',
    category: 'text',
    icon: 'case-sensitive',
    keywords: ['case converter', 'camelcase', 'snake_case', 'kebab-case', 'pascalcase'],
    publishedAt: '2026-07-08',
    featured: true,
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester & Visualizer',
    description: 'Test regular expressions with real-time match highlighting.',
    metaDescription:
      'Free online regex tester with real-time match highlighting and capture group display. Supports JavaScript regex syntax.',
    category: 'developer',
    icon: 'regex',
    keywords: ['regex tester', 'regular expression tester', 'regex online', 'regex match'],
    publishedAt: '2026-07-08',
    featured: true,
  },
  {
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text by paragraphs, sentences or words.',
    metaDescription:
      'Free Lorem ipsum generator. Create custom placeholder text by words, sentences, or paragraphs for your designs and mockups.',
    category: 'generator',
    icon: 'paragraph',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'lorem ipsum'],
    publishedAt: '2026-07-08',
    featured: true,
  },
  {
    slug: 'json-to-yaml',
    title: 'JSON to YAML Converter',
    description: 'Convert JSON to YAML and vice-versa. Useful for config files and Kubernetes manifests.',
    metaDescription: 'Free online JSON to YAML converter. Bidirectional conversion, browser-only, no upload.',
    category: 'developer',
    icon: 'file-code',
    keywords: ['json to yaml', 'yaml converter', 'json yaml'],
    publishedAt: '2026-07-08',
  },
  {
    slug: 'base64-encoder',
    title: 'Base64 Encoder / Decoder',
    description: 'Encode text or decode Base64 strings online.',
    metaDescription:
      'Free Base64 encoder and decoder. Encode plain text to Base64 or decode Base64 back to plain text, instantly in your browser.',
    category: 'developer',
    icon: 'binary',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online'],
    publishedAt: '2026-07-08',
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate UUID v1, v4, v5 and v7 identifiers in bulk.',
    metaDescription: 'Free online UUID generator. Generate single or bulk UUIDs (v1, v4, v5, v7) for your applications.',
    category: 'generator',
    icon: 'fingerprint',
    keywords: ['uuid generator', 'uuid v4', 'uuid v7', 'guid generator'],
    publishedAt: '2026-07-08',
  },
];

export const getTool = (slug: string): ToolConfig | undefined =>
  tools.find((t) => t.slug === slug);

export const toolsByCategory = (cat: ToolCategory) => tools.filter((t) => t.category === cat);

export const categoryMeta: Record<ToolCategory, { label: string; description: string; icon: string }> = {
  developer: { label: 'Developer Tools', description: 'Tools for developers — JSON, regex, encoders, converters.', icon: 'code' },
  text: { label: 'Text Tools', description: 'Text formatting, case conversion, and content manipulation.', icon: 'type' },
  generator: { label: 'Generators', description: 'Lorem ipsum, UUIDs, passwords, random data and more.', icon: 'sparkles' },
  social: { label: 'Social Media Tools', description: 'Tools for YouTube, Instagram, Twitter and more.', icon: 'share-2' },
  design: { label: 'Design Tools', description: 'Color, gradient and CSS design helpers.', icon: 'palette' },
};
