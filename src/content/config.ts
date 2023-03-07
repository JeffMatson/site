import { z, defineCollection } from 'astro:content';

/**
 * Single pages collection.
 */
const singleCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string().default(''),
        author: z.string().default('jeffmatson'),
    }),
});

/**
 * Blog posts collection.
 */
const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string().default(''),
        comments: z.boolean().default(true),
        date: z.string().transform(str => new Date(str)).default(new Date().toISOString()),
        author: z.string().default('jeffmatson'),
    }),
});

/**
 * Authors collection
 */
const authorsCollection = defineCollection({
    schema: z.object({
        name: z.string(),
        description: z.string().default(''),
        firstName: z.string(),
        lastName: z.string(),
        knowsAbout: z.array(z.string()).optional(),
        url: z.string().optional(),
        sameAs: z.array(z.string()).optional().default([]),
    }),
});

/**
 * Collection tags. Maps to `/src/content/<collection>`.
 */
export const collections = {
    'single': singleCollection,
    'blog': blogCollection,
    'authors': authorsCollection,
};