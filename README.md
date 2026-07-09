# UtilHub

> Free, privacy-first online developer & text tools. Static site, 100% in-browser.

🔗 **Live site:** https://utilhub.pages.dev (will move to permanent domain once acquired)

## What's inside

A curated set of tools that run entirely in the browser. No accounts, no uploads, no tracking.

- **Developer tools**: JSON Formatter, JSON → CSV, JSON → YAML, Regex Tester, Base64 Encoder/Decoder, UUID Generator
- **Text tools**: Case Converter (camelCase / snake_case / kebab-case / ...)
- **Generators**: Lorem Ipsum, UUID (v1 / v4 / v5 / v7)

## Tech stack

- **[Astro 5](https://astro.build)** — Static-first framework, SEO-optimized output
- **[Tailwind CSS 3](https://tailwindcss.com)** — Utility-first styling, dark mode built-in
- **TypeScript** — Type-safe tool logic in `src/tools/`
- **[Cloudflare Pages](https://pages.cloudflare.com)** — Edge deployment, free tier
- **[@iconify/astro](https://iconify.design)** — Icon system (lucide icons)
- **[MDX](https://mdxjs.com)** — Blog content for SEO

## Project structure

```
utilhub/
├── astro.config.mjs        # Astro config (sitemap, integrations)
├── tailwind.config.mjs     # Tailwind theme (brand colors)
├── tsconfig.json           # Strict TypeScript
├── public/                 # Static assets (favicon, robots.txt)
├── src/
│   ├── consts.ts           # Site-wide constants
│   ├── config/tools.ts     # ⭐ Single source of truth: tools list
│   ├── tools/              # Pure-function tool logic (.ts files)
│   ├── components/         # UI components (Header, Footer, ToolCard, ...)
│   ├── layouts/            # BaseLayout + ToolLayout
│   ├── pages/
│   │   ├── index.astro     # Homepage
│   │   ├── tools/          # ⭐ One .astro file per tool
│   │   ├── category/       # Category pages
│   │   ├── blog/           # Blog
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   ├── contact.astro
│   │   └── rss.xml.ts      # RSS feed
│   ├── content/blog/       # Blog posts (MDX)
│   └── styles/global.css
└── README.md
```

## Adding a new tool

3 steps. **No code templates to copy — just edit.**

1. **Implement the logic** in `src/tools/<name>.ts` (pure functions, browser-friendly)
2. **Register in `src/config/tools.ts`** (add a `ToolConfig` entry)
3. **Create the page** in `src/pages/tools/<slug>.astro` using `<ToolLayout toolSlug="...">`

The category pages, homepage and sitemap auto-update.

## Local development

```bash
npm install
npm run dev      # → http://localhost:4321
npm run build    # → dist/
npm run preview  # preview built site
```

Requires Node.js ≥ 18 (tested on Node 22).

## Deployment

This site is built to be deployed as a static site. Recommended: **Cloudflare Pages**.

1. Push to GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Connect to Git
3. Framework preset: Astro
4. Build command: `npm run build`
5. Build output: `dist`
6. Save & Deploy — every `git push` triggers a new deploy

## Privacy principles

- All tool processing runs **client-side**. No server, no logging.
- **No analytics** with cross-site tracking. May use Plausible / self-hosted Umami.
- **No ads** until traffic justifies it (typically > 50k monthly PV).
- **No accounts**, ever.

See [`/privacy`](/privacy) on the live site for the full policy.

## License

MIT.

## Contributing

Issues and PRs welcome. Please don't add features that require a backend or user accounts.
