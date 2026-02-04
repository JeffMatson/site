import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://jeffmatson.net',
  integrations: [mdx(), react(), sitemap()],
  output: 'server',
  adapter: cloudflare(),
  prefetch: true
});