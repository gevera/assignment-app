import { describe, expect, it } from 'vitest';
import { itemsQueryPath, itemsQueryToSearchParams, parseItemsQuery } from './items-query';

describe('parseItemsQuery', () => {
	it('applies defaults for empty search params', () => {
		const query = parseItemsQuery(new URL('https://example.test/en/dashboard/items'));
		expect(query).toEqual({
			q: '',
			status: 'all',
			channel: 'all',
			sort: 'updatedAt',
			dir: 'desc',
			page: 1
		});
	});

	it('parses filter and sort params', () => {
		const url = new URL(
			'https://example.test/en/dashboard/items?q=spring&status=active&channel=email&sort=budget&dir=asc&page=3'
		);
		expect(parseItemsQuery(url)).toEqual({
			q: 'spring',
			status: 'active',
			channel: 'email',
			sort: 'budget',
			dir: 'asc',
			page: 3
		});
	});
});

describe('itemsQueryToSearchParams', () => {
	it('omits default values', () => {
		const params = itemsQueryToSearchParams({
			q: '',
			status: 'all',
			channel: 'all',
			sort: 'updatedAt',
			dir: 'desc',
			page: 1
		});
		expect(params.toString()).toBe('');
	});

	it('includes only non-default values and fail flag', () => {
		const params = itemsQueryToSearchParams(
			{
				q: 'ads',
				status: 'paused',
				channel: 'all',
				sort: 'name',
				dir: 'asc',
				page: 2
			},
			{ fail: true }
		);
		expect(params.get('q')).toBe('ads');
		expect(params.get('status')).toBe('paused');
		expect(params.get('channel')).toBeNull();
		expect(params.get('sort')).toBe('name');
		expect(params.get('dir')).toBe('asc');
		expect(params.get('page')).toBe('2');
		expect(params.get('fail')).toBe('1');
	});
});

describe('itemsQueryPath', () => {
	it('builds locale path without default params', () => {
		expect(
			itemsQueryPath('en', {
				q: '',
				status: 'all',
				channel: 'all',
				sort: 'updatedAt',
				dir: 'desc',
				page: 1
			})
		).toBe('/en/dashboard/items');
	});

	it('appends non-default search params', () => {
		expect(
			itemsQueryPath(
				'de',
				{
					q: 'ads',
					status: 'paused',
					channel: 'all',
					sort: 'name',
					dir: 'asc',
					page: 2
				},
				{ fail: true }
			)
		).toBe('/de/dashboard/items?q=ads&status=paused&sort=name&dir=asc&page=2&fail=1');
	});
});
