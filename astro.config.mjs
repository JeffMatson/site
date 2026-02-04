import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://jeffmatson.net',
  integrations: [mdx(), react(), prefetch(), sitemap()],
  output: 'server',
  adapter: cloudflare()
});