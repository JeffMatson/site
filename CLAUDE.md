# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site (jeffmatson.net) built with Astro 5. Intentionally embraces a retro 90s/Windows XP "ugly" aesthetic. Static site — no server runtime, all pages pre-rendered at build time.

## Commands

**Script naming convention:** Entry points are bare verbs (`dev`, `build`, `test`). Variants use `base:qualifier` where `base` is also runnable (`test:run`, `lint:fix`). Standalone utilities use `verb-noun` (`generate-tokens`).

```bash
pnpm dev              # Start dev server (generates tokens first)
pnpm build            # Production build (generates tokens first, output: dist/)
pnpm generate-tokens  # Regenerate src/styles/tokens.css from tokens.ts
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run tests once (test/pages/ Playwright tests excluded, require pre-built dist/)
pnpm test:coverage    # Run tests with coverage
pnpm test:ui          # Interactive Vitest UI
pnpm lint             # Check for lint and format issues
pnpm lint:fix         # Auto-fix lint and format issues
pnpm format           # Auto-format code
pnpm format:mdx       # Format MDX files only
pnpm astro sync       # Regenerate .astro/types.d.ts (run after git clean or fresh clone)
```

- **pnpm config:** `pnpm-workspace.yaml` holds `onlyBuiltDependencies` (build script allowlist). Do not put pnpm settings in `package.json`.

### Linting & Formatting

**Biome** handles linting and formatting for JS/TS/JSX/TSX/CSS/JSON/Astro. Configuration is in `biome.json`. A parent config at `~/biome.json` is also inherited.

**Prettier** handles MDX formatting only (Biome has no MDX support yet). Configuration is in `.prettierrc.json` with `.prettierignore` scoping it exclusively to `src/**/*.mdx`.

- **Formatting:** Tabs, indent width 4, line width 120, single quotes, trailing commas (consistent between Biome and Prettier)
- **Linting:** Recommended rules enabled for JS/TS/JSX/TSX/CSS/JSON
- **Astro files:** Experimental support. Several lint rules (`noUnusedVariables`, `noUnusedImports`, `noExplicitAny`, `noImplicitAnyLet`, `organizeImports`) are disabled for `.astro` files because Biome cannot see into the template section — variables/imports that appear unused in frontmatter are often used in the HTML template
- **MDX files:** Formatted by Prettier (handles both prose and embedded JSX/imports)
- Run `pnpm lint` before committing. Use `pnpm lint:fix` to auto-fix safe issues
- **Gotcha:** Biome enforces import ordering (`organizeImports`). After adding imports to `.tsx`/`.jsx` files, run `pnpm lint:fix` to auto-sort them
- **Gotcha:** Never run `biome check --write` or `--unsafe` on `.astro` files without reviewing the diff — Biome will remove imports and rename variables that are used in the template section but appear unused in the frontmatter

## Architecture

### Framework: Astro with React Islands

- **Astro components** (`.astro`) render server-side only as static HTML
- **React components** (`.tsx`/`.jsx`) are used only for client-side interactivity and hydrate selectively via `client:visible` or `client:only` directives
- All data comes from the filesystem at build time — no runtime API calls
- **Dependency split:** `dependencies` = packages that ship to the browser (React, nanostores, md5, zod) plus Astro and its integrations. `devDependencies` = everything else (sharp, Biome, Vitest, Playwright, tsx, @types/*). CI always runs `pnpm install` (all deps) — no `--omit=dev`.
- **Gotcha:** `sharp` must be listed as a direct `devDependency` — Astro declares it as an optional dep, but pnpm's strict module isolation prevents Astro's build chunks from resolving it otherwise. Do not remove it.
- **Gotcha:** `.astro/` is gitignored but contains generated types needed by VS Code. If JSX elements show `'no interface JSX.IntrinsicElements'` errors, run `pnpm astro sync`. This runs automatically during `dev` and `build`.
- **Gotcha:** Astro scoped styles cannot target elements rendered by React islands (`client:only`/`client:visible`). Use global.css selectors to style elements inside React islands.

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
- `src/components/AnnoyBox.tsx` — Easter egg popup system. Fork cap at 16 boxes. Desktop: random fixed positioning. Mobile (<768px): full-screen sequential "takeover" mode with counter badge. Close All button visible on both.
- `src/hooks/useIsMobile.ts` — `matchMedia`-based mobile detection hook used by YouWon.tsx for render branching
- **Gotcha:** `nanostores` `map.get()` returns the internal state reference. Never mutate it directly — always spread into a new object before calling `.set()`, otherwise subscribers won't be notified (identity check in `.set()`)

### Styling

Plain CSS with a TypeScript design token pipeline — no Sass usage (sass is installed as an unexcludable optional peer dep of Vite):

- **Token source of truth:** `src/styles/tokens.ts` — typed color, theme, typography, and shadow definitions
- **Generated CSS:** `src/styles/tokens.css` — auto-generated via `pnpm generate-tokens` using CSS `@layer` for cascade control
- **Global styles:** `src/styles/global.css` — imports tokens.css and fonts.css, defines element and component styles
- **Font declarations:** `src/styles/fonts.css` — `@font-face` rules for Windows Regular, Comic Neue, Papyrus, Tinos
- **Component styles:** Astro scoped `<style>` blocks and CSS Modules (`.module.css`) for React islands
- **4 themes:** dark (default), light, sanity (accessibility mode), hotdog — defined as typed override maps in tokens.ts, merged via `{ ...base, ...overrides }` spread
- **Fluid typography:** 7-step type scale computed at build time in tokens.ts (`**`-based modular scale, 16px base, 1.2 ratio)
- **Design:** Windows 95-style beveled shadows (`--shadow-offset`, `--shadow-inset`) and retro color palette
- **Mobile breakpoint:** `768px` — used in `@media (max-width: 768px)` across global.css, TopNav.astro, and index.astro
- **Adding tokens:** Add key to `themeTokenKeys` array → add value to `baseTheme` → add overrides in theme-specific objects → run `pnpm generate-tokens`. TypeScript will error until all themes have the new key.
- **SVG in tokens:** `selectArrowSvg()` in tokens.ts generates URL-encoded SVG data URIs with theme-specific colors. Colors must be `encodeURIComponent()`-encoded for use in CSS `url()` values.

Theme is applied by setting a class on `<html>` — an inline script in `Layout.astro` reads localStorage on load to prevent flash. Components consume theme tokens via `var(--token-name)`. The theme names array in Layout.astro's `is:inline` script is intentionally duplicated from `tokens.ts` — inline scripts cannot import ES modules.

To modify themes or typography, edit `src/styles/tokens.ts` and run `pnpm generate-tokens` to regenerate the CSS. `src/styles/tokens.css` is gitignored — never edit it directly. Astro `<style>` blocks use plain CSS with native nesting — do not add `lang="scss"`.

### TypeScript Path Aliases

`tsconfig.json` extends `astro/tsconfigs/strict` (which chains to `base`). The preset already sets `target`, `module`, `moduleResolution`, `resolveJsonModule`, `verbatimModuleSyntax`, `isolatedModules`, `noEmit`, `esModuleInterop`, and `strict` — do not re-add these. Only project-specific options (like `paths`) belong in tsconfig.json.

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@styles/*     → src/styles/*
```

### Key Types

`src/types.ts` defines shared Zod schemas: `ThemeName` (derived from `tokens.ts` via `z.enum(themeNames)`) and `BooleanAsString`. To add a theme, add it to `themeNames` in `tokens.ts` — the Zod schema updates automatically.

### Testing

- Vitest with `happy-dom` environment (1024x768 default viewport)
- `@testing-library/react` for React hook tests (`renderHook`, `act`)
- Test files go in `test/` directory, named `<subject>.test.ts`
- Nanostores can be tested directly — call store functions and assert on `store.get()`
- Call `removeAllAnnoyBoxes()` (or equivalent reset) in `beforeEach` when testing store-dependent logic

## Deployment

Pushes to `master` trigger GitHub Actions → lint → test → build with pnpm + Node 22 → deploys to Cloudflare Pages via Wrangler.
