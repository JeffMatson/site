import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Single pages collection.
 */
const singleCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/single" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    author: z.string().default("jeffmatson"),
  }),
});

/**
 * Blog posts collection.
 */
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    comments: z.boolean().default(true),
    date: z
      .string()
      .transform((str) => new Date(str))
      .default(new Date().toISOString()),
    author: z.string().default("jeffmatson"),
    image: z.string().optional(),
  }),
});

/**
 * Authors collection
 */
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    description: z.string().default(""),
    firstName: z.string(),
    lastName: z.string(),
    knowsAbout: z.array(z.string()).optional(),
    url: z.string().optional(),
    sameAs: z.array(z.string()).optional().default([]),
  }),
});

/**
 * Collection tags. Maps to content directories via glob loaders.
 */
export const collections = {
  single: singleCollection,
  blog: blogCollection,
  authors: authorsCollection,
};
