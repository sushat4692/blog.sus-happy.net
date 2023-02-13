import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";

// const resourcePaths = Object.keys(
//     import.meta.glob([
//         // resvg-wasm
//         "./node_modules/@resvg/resvg-wasm/index_bg.wasm",
//     ])
// );

export default defineConfig({
    site: "https://blog.sus-happy.net",
    integrations: [
        tailwind(),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        sitemap(),
    ],
    markdown: {
        shikiConfig: {},
    },
    output: "server",
    adapter: vercel({
        // includeFiles: resourcePaths,
    }),
});
