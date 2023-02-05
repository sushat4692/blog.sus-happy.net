import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import vercel from "@astrojs/vercel/serverless";

// via: https://github.com/withastro/astro/issues/5357
const shikiResourcePaths = Object.keys(
    import.meta.glob([
        "./node_modules/.pnpm/shiki@*/node_modules/shiki/languages/*.tmLanguage.json",
        "./node_modules/.pnpm/shiki@*/node_modules/shiki/themes/*.json",
    ])
);

// https://astro.build/config
export default defineConfig({
    integrations: [
        tailwind(),
        partytown({
            // Adds dataLayer.push as a forwarding-event.
            config: {
                forward: ["dataLayer.push"],
            },
        }),
    ],
    markdown: {
        shikiConfig: {
            // langs: []
        },
    },
    output: "server",
    adapter: vercel({
        includeFiles: shikiResourcePaths,
    }),
});
