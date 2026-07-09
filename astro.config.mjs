// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

// UtilHub configuration
// https://astro.build/config
export default defineConfig({
  site: 'https://boxr.tools',
  trailingSlash: 'never',

  integrations: [
    mdx(),
    sitemap(),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  compressHTML: true,
  adapter: cloudflare()
});