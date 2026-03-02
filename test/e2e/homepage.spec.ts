import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
	test('has the correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle("Jeff Matson's Super Rad Home Page");
	});
});
