import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    category: z.string().default('General'),
    readingTime: z.number().default(5),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
