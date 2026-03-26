# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site (jeffmatson.net) built with Astro 6. Intentionally embraces a retro 90s/Windows XP "ugly" aesthetic. Static site — no server runtime, all pages pre-rendered at build time.

## Commands

**Script naming convention:** Entry points are bare verbs (`dev`, `build`, `test`). Variants use `base:qualifier` where `base` is also runnable (`test:run`, `lint:fix`). Standalone utilities use `verb-noun` (`generate-tokens`).

```bash
pnpm dev              # Start dev server (generates tokens first)
pnpm build            # Production build (generates tokens first, output: dist/)
pnpm preview          # Preview production build locally (run after pnpm build)
pnpm generate-tokens  # Regenerate src/styles/tokens.css from tokens.ts
pnpm optimize-fonts   # Regenerate WOFF2 font files from fontsource + ttf2woff2
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run unit tests once
pnpm test:coverage    # Run unit tests with coverage
pnpm test:ui          # Interactive Vitest UI
pnpm test:e2e         # Run Playwright E2E tests (builds site first)
pnpm test:screenshots # Capture README screenshots (dark, hotdog, sanity themes)
pnpm lint             # Check for lint and format issues
pnpm lint:fix         # Auto-fix lint and format issues
pnpm format           # Auto-format code
pnpm format:mdx       # Format MDX files only
pnpm astro sync       # Regenerate .astro/types.d.ts (run after git clean or fresh clone)
```

- **pnpm config:** `pnpm-workspace.yaml` holds `onlyBuiltDependencies` (build script allowlist). Do not put pnpm settings in `package.json`.
- **`scripts/` directory:** Build-time scripts live here (e.g., `scripts/generate-tokens.ts`). Place new build-time scripts in this directory.
- **Gotcha:** `pnpm dlx @astrojs/upgrade` is interactive (prompts for confirmation). Let the user run it via `!` prefix in Claude Code, then continue with the results.

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
- **Dependency split:** `dependencies` = packages that ship to the browser (React, nanostores, md5) plus Astro and its integrations. `devDependencies` = everything else (sharp, Biome, Vitest, Playwright, tsx, @types/*). CI always runs `pnpm install` (all deps) — no `--omit=dev`.
- **Dependency pinning:** All versions in `package.json` are exact (no `^` or `~`). This ensures Dependabot PRs update `package.json` directly, not just the lockfile. When adding a dependency, use `pnpm add --save-exact <pkg>` or remove the `^` prefix manually.
- **Gotcha:** Only `@playwright/test` is needed as a dependency — it bundles the browser automation library internally. Do not add the bare `playwright` package.
- **Gotcha:** `sharp` must be listed as a direct `devDependency` — Astro declares it as an optional dep, but pnpm's strict module isolation prevents Astro's build chunks from resolving it otherwise. Do not remove it.
- **Gotcha:** `.astro/` is gitignored but contains generated types needed by VS Code. If JSX elements show `'no interface JSX.IntrinsicElements'` errors, run `pnpm astro sync`. This runs automatically during `dev` and `build`.
- **Gotcha:** `.playwright-mcp/` directory is created by Playwright MCP debugging sessions. Clean it up before committing (`rm -rf .playwright-mcp`).
- **Gotcha:** Astro scoped styles cannot target elements rendered by React islands (`client:only`/`client:visible`). Use global.css selectors to style elements inside React islands.
- **Component organization:** Subdirectories (`Theme/`, `CrappyAds/`) group tightly-coupled components sharing a domain, often with a CSS module and/or barrel `index.tsx`. Standalone single-purpose components live at `src/components/` root.
- **Hydration directives:** `client:visible` for below-fold interactive content (defers JS until scrolled into view). `client:only` for purely client-side components with no meaningful server render (e.g., reads localStorage). No other hydration directives are used in this project.

### Content Collections

Content lives in `src/content/` as MDX files with Zod-validated frontmatter schemas defined in `src/content.config.ts`:

- `blog/` — Blog posts (title, description, date, author, image)
- `single/` — Standalone pages like About, Projects (title, description, author)
- `authors/` — Author metadata

Dynamic routes in `src/pages/` use `getStaticPaths()` + `getCollection()` to generate pages from these collections.
- **Gotcha:** Import `z` from `astro/zod`, not from `astro:content` (deprecated in Astro 6). `defineCollection` still comes from `astro:content`.

### Adding Content

- **Blog post:** Create `src/content/blog/<slug>.mdx`. Required frontmatter: `title` (string), `date` (string, `YYYY-M-D` format like `'2023-6-16'`). Optional: `description` (defaults to `''`), `image` (path like `"/images/featured/<name>.png"` — file must exist in both `src/images/featured/` and `public/images/featured/`), `author` (defaults to `'jeffmatson'`).
- **Single page:** Create `src/content/single/<slug>.mdx`. Required: `title` (string). `description` and `author` have defaults — omit unless needed.
- **Inline images in MDX:** `import { Image } from 'astro:assets'` + `import img from '../../images/file.jpg'`, then `<Image src={img} alt="..." />` in the body.
- Schemas are validated by Zod at build time — see `src/content.config.ts` for exact shapes.

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
- **Gotcha:** Always use Zod `.safeParse()` (not `.parse()`) when validating values from `localStorage` / `@nanostores/persistent`. localStorage can contain corrupted values from browser extensions, manual edits, or schema migrations. The theme store subscriber auto-corrects invalid values to the user's preferred default.

### Styling

Plain CSS with a TypeScript design token pipeline — no Sass usage (sass is installed as an unexcludable optional peer dep of Vite):

- **Token source of truth:** `src/styles/tokens.ts` — typed color, theme, typography, and shadow definitions
- **Generated CSS:** `src/styles/tokens.css` — auto-generated via `pnpm generate-tokens` using CSS `@layer` for cascade control
- **Global styles:** `src/styles/global.css` — imports tokens.css and fonts.css, defines element and component styles
- **Font declarations:** `src/styles/fonts.css` — `@font-face` rules with WOFF2 primary + TTF fallback for W95FA (replaces Windows Regular), Comic Neue, Papyrus, Tinos
- **Font optimization:** `pnpm optimize-fonts` generates WOFF2 files in `public/fonts/` from fontsource packages (`@fontsource/comic-neue`, `@fontsource/tinos`, `@fontsource/win95fa`) and ttf2woff2 (Papyrus). Original TTF files are preserved as fallbacks. WOFF2 files are committed — the script only needs to re-run when source fonts change.
- **Font loading:** All `@font-face` rules use `font-display: swap`. Critical fonts (W95FA, Comic Neue Regular/Bold, Papyrus, Tinos Regular) are preloaded as WOFF2 in `Layout.astro`.
- **Gotcha:** fontkit's `subset.encode()` produces Apple-style TrueType headers (`true`) that ttf2woff2 cannot parse. Do not combine fontkit subsetting with ttf2woff2 conversion — use fontsource pre-subset WOFF2 files instead, or convert full TTFs directly.
- **Gotcha:** W95FA (served as `font-family: "Windows Regular"`) has tighter metrics than the original. `letter-spacing: 0.5px` on `body, select` compensates; `letter-spacing: normal` on `.main` prevents cascade into content fonts (Comic Neue, Papyrus, Tinos).
- **Component styles:** Astro scoped `<style>` blocks and CSS Modules (`.module.css`) for React islands
- **4 themes:** dark (default), light, sanity (accessibility mode), hotdog — defined as typed override maps in tokens.ts, merged via `{ ...base, ...overrides }` spread
- **Fluid typography:** 7-step type scale computed at build time in tokens.ts (`**`-based modular scale, 16px base, 1.2 ratio)
- **Design:** Windows 95-style beveled shadows (`--shadow-offset`, `--shadow-inset`) and retro color palette
- **Mobile breakpoint:** `768px` — used in `@media (max-width: 768px)` across global.css, TopNav.astro, and index.astro
- **Gotcha:** Desktop `:first-child` / `:last-child` padding overrides cascade into mobile breakpoints. Always add explicit resets in `@media (max-width: 768px)` for any pseudo-class padding rules added at desktop.
- **`body` background:** Uses `var(--color-wallpaper)`, not `var(--color-background)`. Content background (`--color-background`) is on `select` elements and the `.main` div inside BrowserWindow. Dark and light themes share the same wallpaper color (`cyanDark`).
- **Adding tokens:** Add key to `themeTokenKeys` array → add value to `baseTheme` → add overrides in theme-specific objects → run `pnpm generate-tokens`. TypeScript will error until all themes have the new key.
- **SVG in tokens:** `selectArrowSvg()` in tokens.ts generates URL-encoded SVG data URIs with theme-specific colors. Colors must be `encodeURIComponent()`-encoded for use in CSS `url()` values.

Theme is applied by setting a class on `<html>` — an inline script in `Layout.astro` reads localStorage on load to prevent flash. Components consume theme tokens via `var(--token-name)`. The theme names array in Layout.astro's `is:inline` script is intentionally duplicated from `tokens.ts` — inline scripts cannot import ES modules.

To modify themes or typography, edit `src/styles/tokens.ts` and run `pnpm generate-tokens` to regenerate the CSS. `src/styles/tokens.css` is gitignored — never edit it directly. Astro `<style>` blocks use plain CSS with native nesting — do not add `lang="scss"`.

### Images & Static Assets

- **Source images:** `src/images/` — processed by Astro's asset pipeline when imported. Featured images go in `src/images/featured/`.
- **Static assets:** `public/` — served as-is (favicons, fonts, files referenced by absolute URL path). Featured image copies also live in `public/images/featured/` for frontmatter `image` paths.
- **README screenshots:** `public/images/screenshots/` — theme screenshots referenced in README.md with relative paths (no leading `/`). Updated via the screenshots GitHub Actions workflow (manual dispatch). Do not commit locally-generated screenshots — the workflow is the source of truth.
- **No `@images/` alias** — use relative imports: `import img from '../images/file.png'`
- **In `.astro`/`.tsx`:** `import img from '../images/file.png'` + `<Image>` from `astro:assets`
- **In MDX frontmatter:** absolute path `"/images/featured/<name>.png"` (resolves to `public/`)
- **In MDX body:** relative import `import img from '../../images/file.jpg'` + `<Image>` from `astro:assets`

### TypeScript Path Aliases

`tsconfig.json` extends `astro/tsconfigs/strict` (which chains to `base`). The preset already sets `target`, `module`, `moduleResolution`, `resolveJsonModule`, `verbatimModuleSyntax`, `isolatedModules`, `noEmit`, `esModuleInterop`, and `strict` — do not re-add these. Only project-specific options (like `paths`) belong in tsconfig.json.

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@styles/*     → src/styles/*
```

### Key Types

`src/types.ts` defines shared Zod schemas: `ThemeName` (derived from `tokens.ts` via `z.enum(themeNames)`) and `BooleanAsString`. To add a theme, add it to `themeNames` in `tokens.ts` — the Zod schema updates automatically.

- **Zod:** Import from `astro/zod` (not `zod` or `astro:content`). Astro 6 bundles Zod v4 via this path. There is no direct `zod` dependency — `astro/zod` is the single source. Works in Astro components, React islands, stores, and Vitest tests (via `getViteConfig()`).

### Utilities

`src/utils.ts` — shared helper functions. Check here before writing new helpers:
- `generateString(prefix?, length?)` — random alphanumeric string (default 16 chars)
- `getViewportSize()` — returns `{ width, height }` viewport dimensions (client-side only)
- `stripTrailingSlash(str)` — removes trailing `/`
- `iso8601ToString(iso8601)` — converts ISO 8601 string to UTC date string via `Date.toUTCString()`
- `emailToGravatar(email)` — returns `{ tiny, normal }` Gravatar URLs via md5 hash

### Testing

Test directory structure:
```
test/
  unit/    # Vitest unit tests (*.test.ts)
  e2e/     # Playwright E2E tests (*.spec.ts)
```

#### Unit Tests (Vitest)

- Vitest with `happy-dom` environment (1024x768 default viewport)
- `@testing-library/react` for React hook tests (`renderHook`, `act`)
- Unit test files go in `test/unit/`, named `<subject>.test.ts`
- Nanostores can be tested directly — call store functions and assert on `store.get()`
- Call `removeAllAnnoyBoxes()` (or equivalent reset) in `beforeEach` when testing store-dependent logic
- **Testing `@nanostores/persistent` stores:** Call `useTestStorageEngine()` from `@nanostores/persistent` *before* importing any persistent store module (use dynamic `await import()`). This replaces happy-dom's localStorage proxy, which rejects the direct property assignment that `@nanostores/persistent` uses internally. Use `setTestStorageKey()` to simulate external storage changes. Avoid `cleanTestStorage()` — it fires listeners with `undefined`, causing ZodErrors in subscribers that validate values.
- **Nanostores identity check:** `atom.set()` skips notification when `oldValue === newValue`. To force subscriber execution in `beforeEach`, toggle to a different value first (e.g., `setTheme('light'); setTheme('dark')`).

#### E2E Tests (Playwright)

- Playwright with Chromium only (personal site, no cross-browser matrix)
- E2E test files go in `test/e2e/`, named `<subject>.spec.ts`
- `pnpm test:e2e` runs the full cycle: build, start preview server, run tests, shut down
- Locally, if a preview server is already running on port 4321, Playwright reuses it (`reuseExistingServer`)
- **Gotcha:** When testing CSS/font changes, kill any running preview server before `pnpm test:e2e` — Playwright reuses the stale server and won't reflect the new build. Use `lsof -ti:4321 | xargs kill` then rebuild.
- Playwright tests use `@playwright/test` imports — do not mix with Vitest imports
- **Not yet in CI** — adding E2E to CI requires installing Chromium (`pnpm exec playwright install chromium`) and running `pnpm test:e2e` after build
- **Screenshot spec** (`test/e2e/screenshots.spec.ts`): Captures themed homepage screenshots for the README. Pauses the marquee CSS animation and resets its position before capture to avoid mid-scroll artifacts.
- **Layout shift spec** (`test/e2e/layout-shift.spec.ts`): CLS regression test across desktop, mobile (Pixel 5), and slow connection (Fast 3G) profiles. Uses CDP `Network.emulateNetworkConditions` for throttling and `page.addInitScript` with `PerformanceObserver` (`type: 'layout-shift', buffered: true`) to capture shifts from first paint. Fresh browser context per test to avoid font cache sharing.

## Deployment

Pushes to `master` trigger GitHub Actions → deploys to Cloudflare Pages via Wrangler. Two workflow files:

- **`.github/workflows/ci.yml`** — Reusable (`workflow_call`) + PR trigger. Runs `check` (lint + test) and `build` in parallel.
- **`.github/workflows/deploy.yml`** — Push to master + `workflow_dispatch`. Calls `ci.yml`, then `deploy` job builds and deploys via Wrangler.
- **`.github/workflows/screenshots.yml`** — Manual dispatch only (owner-gated). Captures README screenshots via Playwright, commits updated images to master if changed. Screenshots live in `public/images/screenshots/`.
- **`.github/dependabot.yml`** — Weekly updates for GitHub Actions versions and npm dependencies.
- **Gotcha:** The `ci` job in `deploy.yml` must have explicit `permissions: contents: read` — top-level `permissions: {}` means reusable workflows inherit nothing unless the calling job grants it.
- **Gotcha:** `pnpm/action-setup` must run before `actions/setup-node` — setup-node calls `pnpm store path` for caching and fails if pnpm isn't installed yet.
- All actions are pinned to commit SHAs. Dependabot keeps them updated.
