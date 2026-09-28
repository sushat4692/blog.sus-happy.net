import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import { headingAnchors } from "./src/markdown/headingAnchors";

export default defineConfig({
    site: "https://blog.sus-happy.net",
    trailingSlash: "ignore",
    redirects: {
        "/feed": "/rss.xml",
    },
    integrations: [
        partytown({ config: { forward: ["dataLayer.push"] } }),
        sitemap(),
    ],
    markdown: {
        shikiConfig: {},
        processor: satteri({ hastPlugins: [headingAnchors] }),
    },
    output: "static",
    adapter: vercel({
        includeFiles: [
            "./node_modules/@resvg/resvg-wasm/index_bg.wasm",
            "./node_modules/harfbuzzjs/hb.wasm",
        ],
    }),
    vite: { plugins: [tailwindcss()] },
});
