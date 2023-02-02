import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.date(),
        updated: z.date().optional(),
        tags: z.array(z.string()).optional(),
        thumbnail: z.string().optional(),
    }),
});

export const collections = <const>{
    blog: blogCollection,
};
