import { devices, expect, test } from '@playwright/test';

interface LayoutShiftWindow extends Window {
	__cls?: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
	hadRecentInput: boolean;
	value: number;
}

const STRICT_THRESHOLD = 0.005;

const pages = ['/', '/about', '/blog'] as const;

const profiles = [
	{
		name: 'desktop',
		contextOptions: {},
		network: { latency: 20, downloadThroughput: 5_000_000, uploadThroughput: 2_500_000 },
		threshold: STRICT_THRESHOLD,
	},
	{
		name: 'mobile',
		contextOptions: { ...devices['Pixel 5'] },
		network: { latency: 60, downloadThroughput: 4_000_000, uploadThroughput: 1_000_000 },
		threshold: STRICT_THRESHOLD,
	},
	{
		name: 'slow connection',
		contextOptions: {},
		network: { latency: 150, downloadThroughput: 187_500, uploadThroughput: 75_000 },
		threshold: 0.1,
	},
] as const;

test.describe('Layout shift regression', () => {
	for (const profile of profiles) {
		test.describe(profile.name, () => {
			for (const path of pages) {
				test(`CLS is below ${profile.threshold} on ${path}`, async ({ browser }) => {
					const context = await browser.newContext(profile.contextOptions);
					const page = await context.newPage();

					const cdp = await context.newCDPSession(page);
					await cdp.send('Network.emulateNetworkConditions', {
						offline: false,
						...profile.network,
					});

					await page.addInitScript(() => {
						(window as LayoutShiftWindow).__cls = 0;
						new PerformanceObserver((list) => {
							for (const entry of list.getEntries() as LayoutShiftEntry[]) {
								if (!entry.hadRecentInput) {
									(window as LayoutShiftWindow).__cls! += entry.value;
								}
							}
						}).observe({ type: 'layout-shift', buffered: true });
					});

					await page.goto(path);
					await page.evaluate(() => document.fonts.ready);
					await page.waitForTimeout(500);

					const totalCLS = await page.evaluate(
						() => (window as LayoutShiftWindow).__cls ?? 0,
					);

					if (totalCLS >= STRICT_THRESHOLD) {
						test.info().annotations.push({
							type: 'CLS warning',
							description: `${path} (${profile.name}): CLS ${totalCLS.toFixed(4)} exceeds strict ${STRICT_THRESHOLD} threshold`,
						});
					}

					expect(
						totalCLS,
						`CLS on ${path} (${profile.name}) was ${totalCLS.toFixed(4)}`,
					).toBeLessThan(profile.threshold);
				});
			}
		});
	}
});
