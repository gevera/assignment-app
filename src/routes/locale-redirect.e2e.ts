import { expect, test } from '@playwright/test';

test.describe('locale redirects', () => {
	test('redirects unprefixed /blog to /en/blog', async ({ page }) => {
		const response = await page.goto('/blog');
		expect(response?.status()).toBe(200);
		expect(page.url()).toContain('/en/blog');
	});

	test('serves /en/blog without redirect', async ({ page }) => {
		const response = await page.goto('/en/blog');
		expect(response?.status()).toBe(200);
		expect(page.url()).toMatch(/\/en\/blog$/);
	});

	test('returns custom 404 for unsupported locale prefix', async ({ page }) => {
		const response = await page.goto('/fr/blog');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
		await expect(page.getByText(/Something went wrong|Etwas ist schiefgelaufen/)).toBeVisible();
	});
});
