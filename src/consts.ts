// Site-wide constants — single source of truth

export const SITE = {
  name: 'UtilHub',
  shortName: 'UtilHub',
  tagline: 'Free Online Developer & Text Tools',
  description:
    'Fast, privacy-friendly online tools for developers and content creators. JSON formatter, regex tester, case converter, lorem ipsum generator and more — no signup, no ads inside tools.',
  url: 'https://utilhub.pages.dev', // Update after domain confirmed
  locale: 'en',
  author: 'UtilHub Team',
  email: 'hello@utilhub.pages.dev',
  twitter: '@utilhub',
  // Update post-launch:
  adSenseId: '',
} as const;

export const NAV = [
  { label: 'All Tools', href: '/' },
  { label: 'Developer', href: '/category/developer' },
  { label: 'Text', href: '/category/text' },
  { label: 'Generator', href: '/category/generator' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
] as const;

export type ToolCategory = 'developer' | 'text' | 'generator' | 'social' | 'design';
