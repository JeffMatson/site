/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		environment: 'happy-dom',
		include: ['test/unit/**/*.test.ts'],
		testTimeout: 60_000,
		hookTimeout: 60_000,
	},
});
