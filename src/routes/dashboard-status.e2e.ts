import { expect, test, type Page } from '@playwright/test';

async function loginAsEditor(page: Page) {
	await page.goto('/en/login');
	await page.locator('input[name="email"]').fill('editor@demo.test');
	await page.locator('input[name="password"]').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL(/\/en\/dashboard\/items/);
}

test.describe('dashboard auth redirects', () => {
	test('redirects anonymous /dashboard to login', async ({ page }) => {
		await page.goto('/en/dashboard');
		await expect(page).toHaveURL(/\/en\/login/);
		expect(page.url()).toContain('redirect=');
	});

	test('redirects authenticated /dashboard to items', async ({ page }) => {
		await loginAsEditor(page);
		await page.goto('/en/dashboard');
		await expect(page).toHaveURL(/\/en\/dashboard\/items/);
	});
});

test.describe('status menu edit', () => {
	test('updates status and rolls back on forced failure', async ({ page }) => {
		await loginAsEditor(page);

		const trigger = page.getByRole('button', { name: /change campaign status/i }).first();
		await expect(trigger).toBeVisible();

		const initialLabel = (await trigger.innerText()).trim();
		await trigger.click();

		const menu = page.getByRole('menu', { name: /change campaign status/i });
		await expect(menu).toBeVisible();

		const nextOption = menu.getByRole('menuitem').filter({ hasNotText: initialLabel }).first();
		const nextLabel = (await nextOption.innerText()).trim();
		await nextOption.click();

		await expect(trigger).toHaveText(nextLabel);

		await page.goto('/en/dashboard/items?fail=1');
		await expect(page.getByRole('heading', { name: /campaigns/i })).toBeVisible();

		const failTrigger = page.getByRole('button', { name: /change campaign status/i }).first();
		const beforeFail = (await failTrigger.innerText()).trim();
		await failTrigger.click();

		const failMenu = page.getByRole('menu', { name: /change campaign status/i });
		const failOption = failMenu
			.getByRole('menuitem')
			.filter({ hasNotText: beforeFail })
			.first();
		await failOption.click();

		await expect(page.getByRole('status')).toContainText(/could not save|reverted/i);
		await expect(failTrigger).toHaveText(beforeFail);
	});
});
