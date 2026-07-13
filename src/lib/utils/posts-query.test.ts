import { describe, expect, it } from 'vitest';
import {
	blogQueryPath,
	blogQueryToSearchParams,
	parseBlogQuery,
	parsePostsQuery,
	postsQueryPath,
	postsQueryToSearchParams
} from './posts-query';

describe('parsePostsQuery', () => {
	it('applies defaults for empty search params', () => {
		expect(parsePostsQuery(new URL('https://example.test/en/search'))).toEqual({
			q: '',
			tag: '',
			sort: 'date',
			fuzzy: false
		});
	});

	it('defaults sort to relevance when q is present', () => {
		expect(parsePostsQuery(new URL('https://example.test/en/search?q=perf'))).toEqual({
			q: 'perf',
			tag: '',
			sort: 'relevance',
			fuzzy: false
		});
	});

	it('parses tag, sort, fuzzy, and limit', () => {
		const url = new URL(
			'https://example.test/en/search?q=design&tag=engineering&sort=title&fuzzy=1&limit=5'
		);
		expect(parsePostsQuery(url)).toEqual({
			q: 'design',
			tag: 'engineering',
			sort: 'title',
			fuzzy: true,
			limit: 5
		});
	});
});

describe('postsQueryToSearchParams', () => {
	it('omits default values', () => {
		expect(
			postsQueryToSearchParams({
				q: '',
				tag: '',
				sort: 'date',
				fuzzy: false
			}).toString()
		).toBe('');
	});

	it('includes non-default values', () => {
		const params = postsQueryToSearchParams({
			q: 'lcp',
			tag: 'performance',
			sort: 'title',
			fuzzy: true,
			limit: 5
		});
		expect(params.get('q')).toBe('lcp');
		expect(params.get('tag')).toBe('performance');
		expect(params.get('sort')).toBe('title');
		expect(params.get('fuzzy')).toBe('1');
		expect(params.get('limit')).toBe('5');
	});
});

describe('postsQueryPath', () => {
	it('builds locale path without default params', () => {
		expect(
			postsQueryPath({
				lang: 'en',
				query: {
					q: '',
					tag: '',
					sort: 'date',
					fuzzy: false
				}
			})
		).toBe('/en/search');
	});

	it('appends non-default search params', () => {
		expect(
			postsQueryPath({
				lang: 'de',
				query: {
					q: 'lcp',
					tag: 'performance',
					sort: 'date',
					fuzzy: true
				}
			})
		).toBe('/de/search?q=lcp&tag=performance&sort=date&fuzzy=1');
	});
});

describe('parseBlogQuery', () => {
	it('applies defaults for empty search params', () => {
		expect(parseBlogQuery(new URL('https://example.test/en/blog'))).toEqual({
			page: 1,
			tag: '',
			sort: 'date'
		});
	});

	it('parses tag, sort, and page', () => {
		expect(
			parseBlogQuery(new URL('https://example.test/en/blog?tag=performance&sort=title&page=2'))
		).toEqual({
			page: 2,
			tag: 'performance',
			sort: 'title'
		});
	});

	it('ignores invalid sort and clamps page', () => {
		expect(parseBlogQuery(new URL('https://example.test/en/blog?sort=relevance&page=0'))).toEqual({
			page: 1,
			tag: '',
			sort: 'date'
		});
	});
});

describe('blogQueryToSearchParams', () => {
	it('omits default values', () => {
		expect(
			blogQueryToSearchParams({
				page: 1,
				tag: '',
				sort: 'date'
			}).toString()
		).toBe('');
	});

	it('includes non-default values', () => {
		const params = blogQueryToSearchParams({
			page: 2,
			tag: 'performance',
			sort: 'title'
		});
		expect(params.get('tag')).toBe('performance');
		expect(params.get('sort')).toBe('title');
		expect(params.get('page')).toBe('2');
	});
});

describe('blogQueryPath', () => {
	it('builds locale path without default params', () => {
		expect(
			blogQueryPath({
				lang: 'en',
				query: {
					page: 1,
					tag: '',
					sort: 'date'
				}
			})
		).toBe('/en/blog');
	});

	it('appends non-default search params', () => {
		expect(
			blogQueryPath({
				lang: 'de',
				query: {
					page: 2,
					tag: 'performance',
					sort: 'title'
				}
			})
		).toBe('/de/blog?tag=performance&sort=title&page=2');
	});
});
