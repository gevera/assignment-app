import { expect, test } from '@playwright/test';

test.describe('blog filter and sort', () => {
	test('filters posts by tag badge', async ({ page }) => {
		await page.goto('/en/blog');

		await page.getByRole('button', { name: 'Performance', exact: true }).first().click();

		await expect(page).toHaveURL(/tag=performance/);
		await expect(page.getByText('Tag: Performance')).toBeVisible();

		const cards = page.locator('ul.grid > li');
		const count = await cards.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			await expect(
				cards.nth(i).getByRole('button', { name: 'Performance', exact: true })
			).toBeVisible();
		}
	});

	test('shows empty state for an unknown tag', async ({ page }) => {
		await page.goto('/en/blog?tag=zzz-no-such-tag');
		await expect(page.getByText('No posts found.')).toBeVisible();
	});

	test('sorts by title then back by date', async ({ page }) => {
		await page.goto('/en/blog');

		const titleSort = page.getByRole('button', { name: 'Title', exact: true });
		await titleSort.click();
		await expect(page).toHaveURL(/sort=title/);
		await expect(titleSort).toHaveAttribute('aria-pressed', 'true');

		const titles = await page.locator('ul.grid h2 a').allTextContents();
		expect(titles.length).toBeGreaterThan(1);
		const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'en'));
		expect(titles).toEqual(sorted);

		const dateSort = page.getByRole('button', { name: 'By Date', exact: true });
		await dateSort.click();
		await expect(page).not.toHaveURL(/sort=/);
		await expect(dateSort).toHaveAttribute('aria-pressed', 'true');
	});

	test('clears the active tag filter', async ({ page }) => {
		await page.goto('/en/blog?tag=performance');
		await expect(page.getByText('Tag: Performance')).toBeVisible();

		await page.getByRole('button', { name: 'Clear tag filter' }).click();

		await expect(page).not.toHaveURL(/tag=/);
		await expect(page.getByText('Tag: Performance')).toHaveCount(0);
		await expect(page.locator('ul.grid > li')).not.toHaveCount(0);
	});
});
