import { page } from 'vitest/browser';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { goto } from '$app/navigation';
import { loadTranslations } from '$lib/i18n';
import type { Item } from '$lib/schemas';
import { itemsQuerySchema, type ItemsQuery } from '$lib/utils/items-query';
import ItemsTable from './ItemsTable.svelte';

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

vi.mock('$app/forms', () => ({
	enhance: () => ({ destroy: () => {} }),
	applyAction: vi.fn(() => Promise.resolve())
}));

const defaultQuery: ItemsQuery = itemsQuerySchema.parse({});

function makeItem(overrides: Partial<Item>): Item {
	return {
		id: 'itm_1',
		name: 'Spring Sale',
		status: 'active',
		channel: 'email',
		owner: { id: 'usr_1', name: 'Ada Lovelace' },
		budget: 12000,
		spent: 4500,
		impressions: 100000,
		clicks: 4230,
		ctr: 0.0423,
		startDate: '2026-05-01',
		endDate: '2026-06-01',
		updatedAt: '2026-05-14T10:00:00.000Z',
		tags: ['sale'],
		...overrides
	};
}

const items: Item[] = [
	makeItem({}),
	makeItem({
		id: 'itm_2',
		name: 'Winter Push',
		status: 'paused',
		channel: 'sms',
		budget: 3300,
		spent: 810,
		ctr: 0.0111
	})
];

describe('ItemsTable.svelte', () => {
	beforeAll(async () => {
		await loadTranslations('en');
	});

	beforeEach(() => {
		vi.mocked(goto).mockClear();
	});

	it('renders read-only rows with localized formatting and no edit controls', async () => {
		render(ItemsTable, { items, query: defaultQuery, canEdit: false, locale: 'en' });

		await expect.element(page.getByText('Spring Sale')).toBeInTheDocument();
		await expect.element(page.getByText('Winter Push')).toBeInTheDocument();
		await expect.element(page.getByText('$12,000')).toBeInTheDocument();
		await expect.element(page.getByText('$3,300')).toBeInTheDocument();
		await expect.element(page.getByText('4.23%')).toBeInTheDocument();
		await expect.element(page.getByText('Active')).toBeInTheDocument();
		await expect.element(page.getByText('Paused')).toBeInTheDocument();

		expect(page.getByRole('textbox').query()).toBeNull();
		expect(page.getByRole('button', { name: 'Change campaign status' }).query()).toBeNull();
	});

	it('renders editable cells and status menus when editing is allowed', async () => {
		render(ItemsTable, { items, query: defaultQuery, canEdit: true, locale: 'en' });

		await expect
			.element(page.getByRole('textbox', { name: 'Edit campaign name' }).first())
			.toHaveValue('Spring Sale');
		expect(page.getByRole('button', { name: 'Change campaign status' }).all()).toHaveLength(2);
	});

	it('exposes the active sort via aria-sort', async () => {
		render(ItemsTable, { items, query: defaultQuery, canEdit: false, locale: 'en' });

		await expect
			.element(page.getByRole('columnheader', { name: 'Updated' }))
			.toHaveAttribute('aria-sort', 'descending');
		await expect
			.element(page.getByRole('columnheader', { name: 'Name' }))
			.toHaveAttribute('aria-sort', 'none');
	});

	it('navigates with the new sort when a column header is clicked', async () => {
		render(ItemsTable, { items, query: defaultQuery, canEdit: false, locale: 'en' });

		await page.getByRole('columnheader', { name: 'Name' }).click();
		expect(goto).toHaveBeenCalledWith('/en/dashboard/items?sort=name&dir=asc', {
			keepFocus: true,
			noScroll: true
		});

		vi.mocked(goto).mockClear();
		await page.getByRole('columnheader', { name: 'Updated' }).click();
		expect(goto).toHaveBeenCalledWith('/en/dashboard/items?dir=asc', {
			keepFocus: true,
			noScroll: true
		});
	});
});
