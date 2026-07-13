import { z } from 'zod';
import { itemChannelSchema, itemStatusSchema } from '$lib/schemas';

export const ITEMS_PER_PAGE = 10;

export const itemsSortSchema = z.enum([
	'name',
	'status',
	'channel',
	'owner',
	'budget',
	'spent',
	'ctr',
	'updatedAt'
]);

export const itemsDirSchema = z.enum(['asc', 'desc']);

export const itemsQuerySchema = z.object({
	q: z.string().default(''),
	status: z.union([z.literal('all'), itemStatusSchema]).default('all'),
	channel: z.union([z.literal('all'), itemChannelSchema]).default('all'),
	sort: itemsSortSchema.default('updatedAt'),
	dir: itemsDirSchema.default('desc'),
	page: z.coerce.number().int().min(1).default(1)
});

export type ItemsQuery = z.infer<typeof itemsQuerySchema>;
export type ItemsSort = z.infer<typeof itemsSortSchema>;
export type ItemsDir = z.infer<typeof itemsDirSchema>;

export function parseItemsQuery(url: URL): ItemsQuery {
	const params = url.searchParams;
	return itemsQuerySchema.parse({
		q: params.get('q') ?? '',
		status: params.get('status') ?? 'all',
		channel: params.get('channel') ?? 'all',
		sort: params.get('sort') ?? 'updatedAt',
		dir: params.get('dir') ?? 'desc',
		page: params.get('page') ?? '1'
	});
}

export function itemsQueryToSearchParams(
	query: ItemsQuery,
	options?: { fail?: boolean }
): URLSearchParams {
	const params = new URLSearchParams();

	if (query.q) params.set('q', query.q);
	if (query.status !== 'all') params.set('status', query.status);
	if (query.channel !== 'all') params.set('channel', query.channel);
	if (query.sort !== 'updatedAt') params.set('sort', query.sort);
	if (query.dir !== 'desc') params.set('dir', query.dir);
	if (query.page !== 1) params.set('page', String(query.page));
	if (options?.fail) params.set('fail', '1');

	return params;
}

/** Pathname (+ optional search) for the items dashboard — pass through `resolve()` before `goto()`. */
export function itemsQueryPath(
	lang: string,
	query: ItemsQuery,
	options?: { fail?: boolean }
): `/${string}` {
	const qs = itemsQueryToSearchParams(query, options).toString();
	const path = `/${lang}/dashboard/items`;
	return (qs ? `${path}?${qs}` : path) as `/${string}`;
}
