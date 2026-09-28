# AGENTS.md

This file provides guidance to opencode (https://opencode.ai) when working with code in this repository.

## Overview

Personal blog ("SUSH-i LOG") built with **Astro 5**, statically generated and deployed to **Vercel**. Site URL is `https://blog.sus-happy.net`. Content (mostly Japanese) lives as Markdown files; styling is Tailwind CSS v4 + scoped SCSS. The README is the stock Astro template and is not an accurate description of this project — ignore it.

## Commands

```bash
npm run dev        # local dev server (astro dev) — note: dev server now daemonizes; stop with `npx astro dev stop`
npm run build      # production build to ./dist/ (+ .vercel/output)
npm run preview    # preview the production build
npm run check      # astro check (type checking) — requires @astrojs/check (installed)
npm run lint       # eslint . (flat config in eslint.config.js)
npm run format     # prettier --write . (respects .prettierignore)
```

There is **no test suite**. textlint (Japanese prose linting) is installed but not wired to a script — run `npx textlint src/content/blog/*.md` directly. Prettier needs `prettier-plugin-astro` (declared in `.prettierrc.cjs`) to parse `.astro` files; `.prettierignore` excludes the blog markdown and build output. ESLint uses flat config (`eslint.config.js`, ESLint 10) — formatting is delegated to Prettier (via `eslint-config-prettier`), not run as an ESLint rule.

Node: Astro 7 requires Node 22+. `.nvmrc` and Volta both pin `22.22.3` (`eslint-plugin-astro` requires `^22.22.3 || ^24.16.0`).

## Architecture

**Content Collections** drive everything, using the **Content Layer API** (Astro 6+). Posts are Markdown in `src/content/blog/`, loaded by a `glob()` loader and validated against the Zod schema in `src/content.config.ts` (frontmatter: `title`, `date`, optional `updated`, `tags[]`, `thumbnail`). Note `z` is imported from `astro/zod`, not `astro:content` (the latter is deprecated). All pages read posts via `getCollection("blog")`; a single entry is fetched with `getEntry("blog", id)`. A post's URL is its `entry.id` (the filename without extension) — use `entry.id`, not the removed `entry.slug`. Render Markdown with the standalone `render(entry)` (imported from `astro:content`), not the removed `entry.render()`. There is no database or CMS — adding a post means adding a `.md` file.

**Routing** (`src/pages/`):
- `index.astro` — first page of the post archive (newest first, `PER_PAGE` = 30 from `src/const.ts`).
- `[...slug].astro` — individual post page; uses `getStaticPaths()` over the collection, renders Markdown, and computes prev/next by sorting all posts by date.
- `page/[...page].astro` — paginated archive (pages 2+).
- `tag/index.astro` — list of all tags; `tag/[slug]/index.astro` and `tag/[slug]/page/[...page].astro` — per-tag archives, paginated. Tag slugs use `github-slugger`.
- `rss.xml.ts` — RSS 2.0 feed (latest `PER_PAGE` posts, title/excerpt/tags per post) built by `@astrojs/rss`; `/feed` and `/feed/` redirect to `/rss.xml` via `astro.config.ts` `redirects`. Auto-discovery `<link>` lives in `BaseLayout.astro`.

**Dynamic OG images** are the one piece of server-rendered logic. `src/pages/api/[slug]/ogp.png.ts` and `src/pages/api/ogp.png.ts` have `export const prerender = false` and run as a Node serverless function on Vercel (the `@astrojs/vercel` v11 adapter ignores per-route `runtime` config, so `node:fs` is available). They build an OG card with **Satori** (HTML/JSX → SVG) and rasterize it with **@resvg/resvg-wasm** (SVG → PNG). Supporting utils in `src/util/`:
- `initResvg.ts` — lazily initializes the resvg WASM module by reading `node_modules/@resvg/resvg-wasm/index_bg.wasm` relative to `process.cwd()` (the same file is copied into the deployed function via `astro.config.ts` `includeFiles`). Do **not** import it with Vite's `?url` — that resolves to a hashed `/_astro/*.wasm` path that doesn't exist inside the function.
- `loadGoogleFont.ts` — fetches a subsetted Noto Sans JP TTF from Google Fonts for only the glyphs being rendered.
- `astro.config.ts` `includeFiles` must also bundle `node_modules/harfbuzzjs/hb.wasm` — Satori 0.33+ uses it for text shaping and reads it from `node_modules` at runtime, so without it the function fails in production with `ENOENT` (works fine in dev).
- The background image is imported with Vite's `?inline` (`src/assets/background.jpg?inline`) so it becomes a base64 data URI at build time. Satori 0.33+ blocks non-public URLs (SSRF protection), so fetching `${url.origin}/content/background.jpg` fails in dev.
- Per-post images (`[slug]/ogp.png.ts`) use the entry's `thumbnail` when present, otherwise the inlined background. The thumbnail is fetched from the request origin with plain `fetch` and converted to a data URI before handing it to Satori (Satori's SSRF guard would otherwise reject the fetch).

**Layout & components**: `src/layouts/BaseLayout.astro` is the single page shell (html/head/body, view transitions via `<ClientRouter />` — the renamed `ViewTransitions`, GTM, global styles). `src/components/PageMeta.astro` centralizes all `<title>`/OG/Twitter meta and is passed into the layout's `head` slot per page. Other components (`Header`, `Footer`, `Hero`, `ArchivePost`, `GTMHead`/`GTMBody`) are presentational.

## Conventions

- **Styling**: Tailwind v4 via the Vite plugin (`@tailwindcss/vite`); config is CSS-first (`@import "tailwindcss"` in `src/styles/global.css`). The legacy `tailwind.config.cjs` is **not loaded** (no `@config` directive) — it's dead. Component styles are `<style lang="scss">` blocks that start with `@reference "tailwindcss";` and use `@apply`. Responsive breakpoints use plain media queries (`@media (min-width: 640px)`) — the v3 `@screen` directive was removed in v4. Class names follow a BEM-ish convention with prefixes (`l-` layout, `c-` component, e.g. `l-container`, `c-archive`). Dark mode via `dark:` variants + `prefers-color-scheme`.
- **Indentation**: 4 spaces, double quotes, 80-col print width (see `.prettierrc.cjs`).
- **Dates**: handled with Luxon (`DateTime.fromJSDate(...)`).
- **Heading anchors**: Markdown is rendered with Astro 7's default **Sätteri** processor, configured in `astro.config.ts` as `markdown.processor: satteri({ hastPlugins: [headingAnchors] })` (needs `@astrojs/markdown-satteri` + `satteri`). `src/markdown/headingAnchors.ts` is a hast plugin that gives each heading an `id` (via `github-slugger`, matching Sätteri's own slugging) and appends `<a class="header-anchor" href="#id">`; the `#` glyph is drawn by CSS in `src/styles/global.css`. Prefer this over `rehypePlugins` — the deprecated `markdown.remarkPlugins`/`rehypePlugins` only run under the `unified()` processor, which is not installed.
- The site is fully static (`output: "static"`); only the OGP API routes opt out of prerendering.
