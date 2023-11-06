import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
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
