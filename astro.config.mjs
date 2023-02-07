import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import vercel from "@astrojs/vercel/serverless";

import { initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await initWasm(
    readFile(join(__dirname, "node_modules/@resvg/resvg-wasm/index_bg.wasm"))
);

// via: https://github.com/withastro/astro/issues/5357
const shikiResourcePaths = Object.keys(
    import.meta.glob([
        "./node_modules/shiki/languages/*.tmLanguage.json",
        "./node_modules/shiki/themes/*.json",

        // resvgwasm
        "./node_modules/@resvg/resvg-wasm/index_bg.wasm",
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
