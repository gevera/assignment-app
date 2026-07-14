import { expect, test } from '@playwright/test';

test.describe('visual regression', () => {
	test('home page matches the baseline', async ({ page }) => {
		await page.goto('/en');
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await page.evaluate(() => document.fonts.ready);

		await expect(page).toHaveScreenshot('home-en.png', {
			fullPage: false,
			animations: 'disabled'
		});
	});
});
