import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    site: "https://blog.sus-happy.net",
    trailingSlash: "ignore",
    integrations: [
        partytown({ config: { forward: ["dataLayer.push"] } }),
        sitemap(),
    ],
    markdown: { shikiConfig: {} },
    output: "static",
    adapter: vercel({
        includeFiles: ["./node_modules/@resvg/resvg-wasm/index_bg.wasm"],
    }),
    vite: { plugins: [tailwindcss()] },
});
