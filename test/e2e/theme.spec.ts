import { expect, test } from '@playwright/test';

test.describe('Theme switching', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Wait for the theme select to hydrate (client:only)
		await page.waitForSelector('#themeSelector');
	});

	test('default theme class is applied to html element', async ({ page }) => {
		const html = page.locator('html');
		await expect(html).toHaveClass(/dark|light|sanity|hotdog/);
	});

	test('selecting a theme updates the html class', async ({ page }) => {
		const html = page.locator('html');
		const select = page.locator('#themeSelector');

		await select.selectOption('hotdog');
		await expect(html).toHaveClass(/hotdog/);

		await select.selectOption('sanity');
		await expect(html).toHaveClass(/sanity/);
		await expect(html).not.toHaveClass(/hotdog/);
	});

	test('theme persists across page navigation', async ({ page }) => {
		const select = page.locator('#themeSelector');
		await select.selectOption('light');

		await page.goto('/blog');
		await page.waitForSelector('#themeSelector');

		const html = page.locator('html');
		await expect(html).toHaveClass(/light/);

		const selectedValue = await page.locator('#themeSelector').inputValue();
		expect(selectedValue).toBe('light');
	});

	test('theme persists after full page reload', async ({ page }) => {
		const select = page.locator('#themeSelector');
		await select.selectOption('hotdog');

		await page.reload();
		await page.waitForSelector('#themeSelector');

		const html = page.locator('html');
		await expect(html).toHaveClass(/hotdog/);

		const selectedValue = await page.locator('#themeSelector').inputValue();
		expect(selectedValue).toBe('hotdog');
	});

	test('all four themes can be selected', async ({ page }) => {
		const html = page.locator('html');
		const select = page.locator('#themeSelector');
		const themes = ['dark', 'light', 'sanity', 'hotdog'];

		for (const theme of themes) {
			await select.selectOption(theme);
			await expect(html).toHaveClass(new RegExp(`\\b${theme}\\b`));
		}
	});

	test('switching themes changes computed styles on visible elements', async ({ page }) => {
		const select = page.locator('#themeSelector');

		// The <select> element uses --color-background and --color-text directly
		const getSelectStyles = () =>
			page.evaluate(() => {
				const el = document.getElementById('themeSelector')!;
				const style = window.getComputedStyle(el);
				return {
					background: style.backgroundColor,
					color: style.color,
				};
			});

		await select.selectOption('dark');
		const dark = await getSelectStyles();

		await select.selectOption('light');
		const light = await getSelectStyles();

		await select.selectOption('hotdog');
		const hotdog = await getSelectStyles();

		// dark: black background, white text | light: white bg, black text | hotdog: yellow bg, black text
		expect(dark.background).not.toBe(light.background);
		expect(dark.color).not.toBe(light.color);
		expect(light.background).not.toBe(hotdog.background);
	});

	test('CSS custom properties update when theme changes', async ({ page }) => {
		const select = page.locator('#themeSelector');

		const getTokens = () =>
			page.evaluate(() => {
				const style = window.getComputedStyle(document.documentElement);
				return {
					background: style.getPropertyValue('--color-background').trim(),
					text: style.getPropertyValue('--color-text').trim(),
					link: style.getPropertyValue('--color-a').trim(),
				};
			});

		await select.selectOption('dark');
		const dark = await getTokens();

		await select.selectOption('hotdog');
		const hotdog = await getTokens();

		await select.selectOption('sanity');
		const sanity = await getTokens();

		// dark: black background, white text
		expect(dark.background).toBe('#000000');
		expect(dark.text).toBe('#ffffff');

		// hotdog: yellow background, black text, red links
		expect(hotdog.background).toBe('#ffff04');
		expect(hotdog.text).toBe('#000000');
		expect(hotdog.link).toBe('#fe0000');

		// sanity: white background, black text, blue links
		expect(sanity.background).toBe('#ffffff');
		expect(sanity.text).toBe('#000000');
		expect(sanity.link).toBe('#0000ff');
	});
});
