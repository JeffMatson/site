# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site (jeffmatson.net) built with Astro 5. Intentionally embraces a retro 90s/Windows XP "ugly" aesthetic. Static site — no server runtime, all pages pre-rendered at build time.

## Commands

```bash
pnpm dev              # Start dev server (generates tokens first)
pnpm build            # Production build (generates tokens first, output: dist/)
pnpm generate-tokens  # Regenerate src/styles/tokens.css from tokens.ts
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run tests once
pnpm coverage         # Run tests with coverage
pnpm test-ui          # Interactive Vitest UI
pnpm lint             # Check for lint and format issues
pnpm lint:fix         # Auto-fix lint and format issues
pnpm format           # Auto-format code
pnpm format:mdx       # Format MDX files only
```

### Linting & Formatting

**Biome** handles linting and formatting for JS/TS/JSX/TSX/CSS/JSON/Astro. Configuration is in `biome.json`. A parent config at `~/biome.json` is also inherited.

**Prettier** handles MDX formatting only (Biome has no MDX support yet). Configuration is in `.prettierrc.json` with `.prettierignore` scoping it exclusively to `src/**/*.mdx`.

- **Formatting:** Tabs, indent width 4, line width 120, single quotes, trailing commas (consistent between Biome and Prettier)
- **Linting:** Recommended rules enabled for JS/TS/JSX/TSX/CSS/JSON
- **Astro files:** Experimental support. Several lint rules (`noUnusedVariables`, `noUnusedImports`, `noExplicitAny`, `noImplicitAnyLet`, `organizeImports`) are disabled for `.astro` files because Biome cannot see into the template section — variables/imports that appear unused in frontmatter are often used in the HTML template
- **MDX files:** Formatted by Prettier (handles both prose and embedded JSX/imports)
- Run `pnpm lint` before committing. Use `pnpm lint:fix` to auto-fix safe issues
- **Gotcha:** Never run `biome check --write` or `--unsafe` on `.astro` files without reviewing the diff — Biome will remove imports and rename variables that are used in the template section but appear unused in the frontmatter

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

Plain CSS with a TypeScript design token pipeline — no Sass dependency:

- **Token source of truth:** `src/styles/tokens.ts` — typed color, theme, typography, and shadow definitions
- **Generated CSS:** `src/styles/tokens.css` — auto-generated via `pnpm generate-tokens` using CSS `@layer` for cascade control
- **Global styles:** `src/styles/global.css` — imports tokens.css and fonts.css, defines element and component styles
- **Font declarations:** `src/styles/fonts.css` — `@font-face` rules for Windows Regular, Comic Neue, Papyrus, Tinos
- **Component styles:** Astro scoped `<style>` blocks and CSS Modules (`.module.css`) for React islands
- **4 themes:** dark (default), light, sanity (accessibility mode), hotdog — defined as typed override maps in tokens.ts, merged via `{ ...base, ...overrides }` spread
- **Fluid typography:** 7-step type scale computed at build time in tokens.ts (`**`-based modular scale, 16px base, 1.2 ratio)
- **Design:** Windows 95-style beveled shadows (`--shadow-offset`, `--shadow-inset`) and retro color palette

Theme is applied by setting a class on `<html>` — an inline script in `Layout.astro` reads localStorage on load to prevent flash. Components consume theme tokens via `var(--token-name)`.

To modify themes or typography, edit `src/styles/tokens.ts` and run `pnpm generate-tokens` to regenerate the CSS. `src/styles/tokens.css` is gitignored — never edit it directly. Astro `<style>` blocks use plain CSS with native nesting — do not add `lang="scss"`.

### TypeScript Path Aliases

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@styles/*     → src/styles/*
```

### Key Types

`src/types.ts` defines shared Zod schemas: `ThemeName` (derived from `tokens.ts` via `z.enum(themeNames)`) and `BooleanAsString`. To add a theme, add it to `themeNames` in `tokens.ts` — the Zod schema updates automatically.

## Deployment

Pushes to `master` trigger GitHub Actions → builds with pnpm + Node 22 → deploys to Cloudflare Pages via Wrangler.
