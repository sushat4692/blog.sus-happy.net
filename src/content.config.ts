import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            date: z.date(),
            updated: z.date().optional(),
            tags: z.array(z.string()).optional(),
            thumbnail: image().optional(),
        }),
});

export const collections = <const>{
    blog: blogCollection,
};
