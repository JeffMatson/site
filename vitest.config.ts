/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		environment: 'happy-dom',
		exclude: ['test/pages/**', 'node_modules/**'],
		testTimeout: 60_000,
		hookTimeout: 60_000,
	},
});
