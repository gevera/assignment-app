import { expect, test, type Page } from '@playwright/test';
import { expectNoSeriousAxeViolations } from '../lib/test/axe';

async function loginAsEditor(page: Page) {
	await page.goto('/en/login');
	await page.locator('input[name="email"]').fill('editor@demo.test');
	await page.locator('input[name="password"]').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL(/\/en\/dashboard\/items/);
}

test.describe('dashboard keyboard operability', () => {
	test.beforeEach(async ({ page }) => {
		await loginAsEditor(page);
	});

	test('sorts a column with Enter', async ({ page }) => {
		const nameHeader = page.getByRole('columnheader', { name: /name/i });
		await nameHeader.focus();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/sort=name/);
		await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
	});

	test('filters by name from the search field', async ({ page }) => {
		const search = page.getByRole('searchbox', { name: /filter by name/i });
		await search.focus();
		await search.fill('zzzz-no-match-xyz');
		await expect(page).toHaveURL(/q=zzzz-no-match-xyz/);
		await expect(page.getByText('No campaigns yet.')).toBeVisible();
		await expect(page.getByText(/^0 of \d+ rows$/)).toBeVisible();
	});

	test('paginates with the next-page control', async ({ page }) => {
		const next = page.getByRole('button', { name: /next page/i });
		await next.focus();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/page=2/);
		await expect(page.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
	});

	test('edits status via keyboard menu', async ({ page }) => {
		const trigger = page.getByRole('button', { name: /change campaign status/i }).first();
		const initialLabel = (await trigger.innerText()).trim();
		await trigger.focus();
		await page.keyboard.press('Enter');

		const menu = page.getByRole('menu', { name: /change campaign status/i });
		await expect(menu).toBeVisible();
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect(trigger).not.toHaveText(initialLabel);
	});
});

test.describe('axe accessibility', () => {
	test('public home has no serious or critical violations', async ({ page }) => {
		await page.goto('/en');
		await expect(page.getByRole('link', { name: /skip to content/i })).toBeAttached();
		await expectNoSeriousAxeViolations(page);
	});

	test('blog index has no serious or critical violations', async ({ page }) => {
		await page.goto('/en/blog');
		await expectNoSeriousAxeViolations(page);
	});

	test('login has no serious or critical violations', async ({ page }) => {
		await page.goto('/en/login');
		await expectNoSeriousAxeViolations(page);
	});

	test('dashboard items has no serious or critical violations (light)', async ({ page }) => {
		await loginAsEditor(page);
		await page.evaluate(() => {
			document.documentElement.dataset.theme = 'light';
		});
		await expect(page.getByRole('heading', { name: /campaigns/i })).toBeVisible();
		await expectNoSeriousAxeViolations(page);
	});

	test('dashboard items has no serious or critical violations (dark)', async ({ page }) => {
		await loginAsEditor(page);
		await page.evaluate(() => {
			document.documentElement.dataset.theme = 'dark';
			localStorage.setItem('theme', 'dark');
		});
		await expect(page.getByRole('heading', { name: /campaigns/i })).toBeVisible();
		await expectNoSeriousAxeViolations(page);
	});
});
