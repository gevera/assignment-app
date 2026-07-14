import { page } from 'vitest/browser';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { goto } from '$app/navigation';
import { loadTranslations } from '$lib/i18n';
import { itemsQuerySchema, type ItemsQuery } from '$lib/utils/items-query';
import Pager from './Pager.svelte';

vi.mock('$app/state', () => ({
	page: {
		url: new URL('http://localhost/en/dashboard/items'),
		params: { lang: 'en' },
		state: {}
	}
}));

vi.mock('$app/navigation', async (importOriginal) => ({
	...(await importOriginal<typeof import('$app/navigation')>()),
	goto: vi.fn(() => Promise.resolve()),
	invalidate: vi.fn(() => Promise.resolve())
}));

const defaultQuery: ItemsQuery = itemsQuerySchema.parse({});

describe('Pager.svelte', () => {
	beforeAll(async () => {
		await loadTranslations('en');
	});

	beforeEach(() => {
		vi.mocked(goto).mockClear();
	});

	it('shows the visible range and marks the current page', async () => {
		render(Pager, { query: defaultQuery, total: 42, pageCount: 5, currentPage: 1, perPage: 10 });

		await expect.element(page.getByText('Showing 1–10 of 42')).toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: '1', exact: true }))
			.toHaveAttribute('aria-current', 'page');
		await expect.element(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
		await expect.element(page.getByRole('button', { name: 'Next page' })).toBeEnabled();
	});

	it('windows page buttons around the current page', async () => {
		render(Pager, {
			query: { ...defaultQuery, page: 6 },
			total: 100,
			pageCount: 10,
			currentPage: 6,
			perPage: 10
		});

		for (const label of ['4', '5', '6', '7', '8']) {
			await expect
				.element(page.getByRole('button', { name: label, exact: true }))
				.toBeInTheDocument();
		}
		expect(page.getByRole('button', { name: '3', exact: true }).query()).toBeNull();
		expect(page.getByRole('button', { name: '9', exact: true }).query()).toBeNull();
	});

	it('navigates to a page link but never past the last page', async () => {
		render(Pager, {
			query: { ...defaultQuery, page: 5 },
			total: 42,
			pageCount: 5,
			currentPage: 5,
			perPage: 10
		});

		await expect.element(page.getByText('Showing 41–42 of 42')).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Next page' })).toBeDisabled();

		await page.getByRole('button', { name: '3', exact: true }).click();
		expect(goto).toHaveBeenCalledWith('/en/dashboard/items?page=3', {
			keepFocus: true,
			noScroll: true
		});

		vi.mocked(goto).mockClear();
		await page.getByRole('button', { name: '5', exact: true }).click();
		expect(goto).not.toHaveBeenCalled();
	});
});
