import { page } from 'vitest/browser';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { goto } from '$app/navigation';
import { loadTranslations } from '$lib/i18n';
import TagBadge from './TagBadge.svelte';

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

describe('TagBadge.svelte', () => {
	beforeAll(async () => {
		await loadTranslations('en');
	});

	beforeEach(() => {
		vi.mocked(goto).mockClear();
	});

	it('navigates to the blog filtered by the tag slug', async () => {
		render(TagBadge, { slug: 'performance', label: 'Performance' });

		await page.getByRole('button', { name: 'Performance', exact: true }).click();

		expect(goto).toHaveBeenCalledWith('/en/blog?tag=performance');
	});
});
