import { expect, test, type Page } from '@playwright/test';

const POST_TITLE = 'Accessible combobox from scratch';
const POST_SLUG = 'accessible-combobox-from-scratch';

/**
 * Open the search dialog from the navbar. The prerendered page may not be
 * hydrated yet when the first click lands, so retry until the dialog appears.
 */
async function openSearchDialog(page: Page) {
	const dialog = page.getByRole('dialog', { name: 'Search' });
	await expect(async () => {
		await page.getByRole('button', { name: 'Search', exact: true }).first().click();
		await expect(dialog).toBeVisible({ timeout: 1500 });
	}).toPass();
	return dialog;
}

test.describe('anonymous search flow', () => {
	test('search from home, click a result, land on the post', async ({ page }) => {
		await page.goto('/en');

		const dialog = await openSearchDialog(page);
		await expect(page).toHaveURL(/\/en\/search/);

		await dialog.getByRole('searchbox', { name: /search posts/i }).fill('combobox');

		const result = dialog.getByRole('option', { name: new RegExp(POST_TITLE, 'i') });
		await expect(result).toBeVisible();
		await expect(page).toHaveURL(/q=combobox/);

		await result.click();

		await expect(page).toHaveURL(new RegExp(`/en/blog/${POST_SLUG}`));
		await expect(page.getByRole('heading', { level: 1, name: POST_TITLE })).toBeVisible();
	});

	test('browser back from the post returns to the search overlay', async ({ page }) => {
		await page.goto('/en');

		const dialog = await openSearchDialog(page);
		await dialog.getByRole('searchbox', { name: /search posts/i }).fill('combobox');
		await dialog.getByRole('option', { name: new RegExp(POST_TITLE, 'i') }).click();
		await expect(page).toHaveURL(new RegExp(`/en/blog/${POST_SLUG}`));

		await page.goBack();
		await expect(page).toHaveURL(/\/en\/search/);
		await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible();
	});

	test('opens with the keyboard shortcut and closes with Escape', async ({ page }) => {
		await page.goto('/en');

		const dialog = page.getByRole('dialog', { name: 'Search' });
		// The prerendered home page may not be hydrated yet, so retry the shortcut.
		await expect(async () => {
			await page.keyboard.press('ControlOrMeta+k');
			await expect(dialog).toBeVisible({ timeout: 1500 });
		}).toPass();
		await expect(page).toHaveURL(/\/en\/search/);

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
		await expect(page).toHaveURL(/\/en$/);
	});
});
