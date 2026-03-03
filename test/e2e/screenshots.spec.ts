import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';

const screenshotDir = resolve(import.meta.dirname, '../../public/images/screenshots');

const themes = ['dark', 'hotdog', 'sanity'] as const;

test.describe('README screenshots', () => {
	for (const theme of themes) {
		test(`capture ${theme} theme`, async ({ page }) => {
			await page.goto('/');
			await page.waitForSelector('#themeSelector');

			const html = page.locator('html');
			const select = page.locator('#themeSelector');

			await select.selectOption(theme);
			await expect(html).toHaveClass(new RegExp(`\\b${theme}\\b`));

			// Pause the marquee animation so it doesn't get caught mid-scroll
			await page.evaluate(() => {
				const marquee = document.querySelector('.inner') as HTMLElement | null;
				if (marquee) {
					marquee.style.animationPlayState = 'paused';
					marquee.style.paddingLeft = '16px';
					marquee.style.transform = 'translate(0, 0)';
				}
			});

			// Let CSS transitions settle before capture
			await page.waitForTimeout(300);

			await page.screenshot({
				path: resolve(screenshotDir, `${theme}.png`),
				fullPage: false,
			});
		});
	}
});
