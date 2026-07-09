import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '~/consts';

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response('Site URL not configured', { status: 500 });
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${new URL(`/blog/${post.slug}`, site).toString()}</link>
      <guid>${new URL(`/blog/${post.slug}`, site).toString()}</guid>
      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
    </item>
  `
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE.name} Blog</title>
    <link>${site.toString()}</link>
    <description>Articles, guides and tips for developers.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
