import { describe, expect, it } from 'vitest';
import { getAllPosts, listPosts, queryPosts } from './posts';

describe('queryPosts', () => {
	it('returns five most recent posts when query is empty', () => {
		const result = queryPosts({
			q: '',
			tag: '',
			sort: 'date',
			fuzzy: false,
			lang: 'en'
		});
		expect(result.posts).toHaveLength(5);
		expect(result.total).toBe(getAllPosts().length);
		for (let i = 1; i < result.posts.length; i++) {
			expect(result.posts[i - 1].publishedAt >= result.posts[i].publishedAt).toBe(true);
		}
	});

	it('filters by title substring', () => {
		const sample = getAllPosts()[0];
		const fragment = sample.translations.en.title.slice(0, 6).toLowerCase();
		const result = queryPosts({
			q: fragment,
			tag: '',
			sort: 'relevance',
			fuzzy: false,
			lang: 'en'
		});
		expect(result.total).toBeGreaterThan(0);
		expect(
			result.posts.every((post) => {
				const t = post.translations.en;
				return (
					t.title.toLowerCase().includes(fragment) ||
					t.excerpt.toLowerCase().includes(fragment) ||
					post.tags.some((tag) => tag.toLowerCase().includes(fragment))
				);
			})
		).toBe(true);
	});

	it('filters by tag slug', () => {
		const result = queryPosts({
			q: '',
			tag: 'performance',
			sort: 'date',
			fuzzy: false,
			lang: 'en'
		});
		expect(result.total).toBeGreaterThan(0);
		expect(result.posts.every((post) => post.tags.includes('performance'))).toBe(true);
	});

	it('sorts by title', () => {
		const result = queryPosts({
			q: 'a',
			tag: '',
			sort: 'title',
			fuzzy: false,
			lang: 'en'
		});
		const titles = result.posts.map((post) => post.translations.en.title);
		const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'en'));
		expect(titles).toEqual(sorted);
	});

	it('supports fuzzy matching', () => {
		const result = queryPosts({
			q: 'performnce',
			tag: '',
			sort: 'relevance',
			fuzzy: true,
			lang: 'en'
		});
		expect(result.total).toBeGreaterThan(0);
	});

	it('returns empty when nothing matches', () => {
		const result = queryPosts({
			q: 'zzz-no-such-post-zzz',
			tag: '',
			sort: 'relevance',
			fuzzy: false,
			lang: 'en'
		});
		expect(result.total).toBe(0);
		expect(result.posts).toHaveLength(0);
	});
});

describe('listPosts', () => {
	it('paginates six posts per page', () => {
		const result = listPosts({ page: 1, tag: '', sort: 'date', lang: 'en' });
		expect(result.perPage).toBe(6);
		expect(result.posts).toHaveLength(6);
		expect(result.total).toBe(getAllPosts().length);
		expect(result.pageCount).toBe(Math.ceil(result.total / 6));
	});

	it('clamps page when beyond pageCount', () => {
		const result = listPosts({ page: 9999, tag: '', sort: 'date', lang: 'en' });
		expect(result.page).toBe(result.pageCount);
		expect(result.posts.length).toBeGreaterThan(0);
	});

	it('filters by tag slug', () => {
		const result = listPosts({ page: 1, tag: 'performance', sort: 'date', lang: 'en' });
		expect(result.total).toBeGreaterThan(0);
		expect(result.posts.every((post) => post.tags.includes('performance'))).toBe(true);
	});

	it('sorts by title ascending', () => {
		const result = listPosts({ page: 1, tag: '', sort: 'title', lang: 'en' });
		const titles = result.posts.map((post) => post.translations.en.title);
		const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'en'));
		expect(titles).toEqual(sorted);
	});

	it('returns empty page when tag matches nothing', () => {
		const result = listPosts({ page: 1, tag: 'zzz-no-such-tag', sort: 'date', lang: 'en' });
		expect(result.total).toBe(0);
		expect(result.posts).toHaveLength(0);
		expect(result.pageCount).toBe(1);
		expect(result.page).toBe(1);
	});
});
