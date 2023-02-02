import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
// import vercel from "@astrojs/vercel/serverless";

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
    // output: "server",
    // adapter: vercel(),
});
