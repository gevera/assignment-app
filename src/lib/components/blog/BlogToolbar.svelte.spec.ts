import { page } from 'vitest/browser';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { goto } from '$app/navigation';
import { loadTranslations } from '$lib/i18n';
import type { Tag } from '$lib/schemas';
import type { BlogQuery } from '$lib/utils/posts-query';
import BlogToolbar from './BlogToolbar.svelte';

vi.mock('$app/state', () => ({
	page: {
		url: new URL('http://localhost/en/blog'),
		params: { lang: 'en' },
		state: {}
	}
}));

vi.mock('$app/navigation', async (importOriginal) => ({
	...(await importOriginal<typeof import('$app/navigation')>()),
	goto: vi.fn(() => Promise.resolve())
}));

const tags: Tag[] = [
	{
		slug: 'performance',
		label: { en: 'Performance', de: 'Performance' }
	}
];

const defaultQuery: BlogQuery = { page: 1, tag: '', sort: 'date' };

describe('BlogToolbar.svelte', () => {
	beforeAll(async () => {
		await loadTranslations('en');
	});

	beforeEach(() => {
		vi.mocked(goto).mockClear();
	});

	it('navigates with sort=title when Title is clicked', async () => {
		render(BlogToolbar, { query: defaultQuery, tags });

		await page.getByRole('button', { name: 'Title', exact: true }).click();

		expect(goto).toHaveBeenCalledWith('/en/blog?sort=title', {
			keepFocus: true,
			noScroll: true
		});
	});

	it('clears the tag filter and resets to page one', async () => {
		render(BlogToolbar, {
			query: { page: 2, tag: 'performance', sort: 'date' },
			tags
		});

		await expect.element(page.getByText('Tag: Performance')).toBeInTheDocument();

		await page.getByRole('button', { name: 'Clear tag filter' }).click();

		expect(goto).toHaveBeenCalledWith('/en/blog', {
			keepFocus: true,
			noScroll: true
		});
	});

	it('does not navigate when the active sort is clicked again', async () => {
		render(BlogToolbar, { query: defaultQuery, tags });

		await page.getByRole('button', { name: 'By Date', exact: true }).click();

		expect(goto).not.toHaveBeenCalled();
	});
});
