# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site (jeffmatson.net) built with Astro 5. Intentionally embraces a retro 90s/Windows XP "ugly" aesthetic. Static site — no server runtime, all pages pre-rendered at build time.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build (output: dist/)
pnpm test         # Run Vitest in watch mode
pnpm test:run     # Run tests once
pnpm coverage     # Run tests with coverage
pnpm test-ui      # Interactive Vitest UI
```

No linter or formatter is configured.

## Architecture

### Framework: Astro with React Islands

- **Astro components** (`.astro`) render server-side only as static HTML
- **React components** (`.tsx`/`.jsx`) are used only for client-side interactivity and hydrate selectively via `client:visible` or `client:only` directives
- All data comes from the filesystem at build time — no runtime API calls

### Content Collections

Content lives in `src/content/` as MDX files with Zod-validated frontmatter schemas defined in `src/content.config.ts`:

- `blog/` — Blog posts (title, description, date, author, image)
- `single/` — Standalone pages like About, Projects (title, description, author)
- `authors/` — Author metadata

Dynamic routes in `src/pages/` use `getStaticPaths()` + `getCollection()` to generate pages from these collections.

### Routing

File-based routing via `src/pages/`:
- `index.astro` → `/`
- `[slug].astro` → Single pages from the `single` collection
- `blog/index.astro` → `/blog`
- `blog/[slug].astro` → Individual blog posts
- `rss.xml.ts` → RSS feed

### State Management

Client-side state uses **Nanostores** with `@nanostores/persistent` for localStorage persistence:
- `src/stores/themeStore.ts` — Theme selection (light/dark/sanity/hotdog), palette, reduced motion preference
- `src/stores/annoyBoxStore.ts` — Interactive popup/annoyance box state

### Styling

SCSS with a theme system based on CSS custom properties:
- `src/styles/global.scss` — Global styles entry point
- `src/styles/config/themes/` — Theme definitions (light, dark, sanity, hotdog)
- Component-scoped styles use CSS Modules (`.module.scss`)
- Design uses Windows 95-style beveled shadows and retro color palette

Theme is applied by setting a class on `<html>` — an inline script in `Layout.astro` reads localStorage on load to prevent flash.

### TypeScript Path Aliases

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@styles/*     → src/styles/*
```

### Key Types

`src/types.ts` defines shared Zod schemas: `ThemeName` (light | dark | sanity | hotdog) and `BooleanAsString`.

## Deployment

Pushes to `master` trigger GitHub Actions → builds with pnpm + Node 22 → deploys to Cloudflare Pages via Wrangler.
