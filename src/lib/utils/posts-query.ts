import { z } from 'zod';
import {
	postsQueryPath,
	postsQueryToSearchParams,
	type PostsQuery,
	type PostsSort
} from './posts-query-path';

export { postsQueryPath, postsQueryToSearchParams };
export type { PostsQuery, PostsSort };

export const POSTS_PER_PAGE = 6;
export const SEARCH_RECENT_LIMIT = 5;

export const postsSortSchema = z.enum(['relevance', 'date', 'title']);

export const postsQuerySchema = z.object({
	q: z.string().default(''),
	tag: z.string().default(''),
	sort: postsSortSchema.default('date'),
	fuzzy: z.boolean().default(false),
	limit: z.coerce.number().int().positive().optional()
});

/** Parse a fuzzy flag from search params ('1' or 'true'). */
function parseFuzzy(value: string | null): boolean {
	return value === '1' || value === 'true';
}

/** Parse and validate posts search query params from a URL. */
export function parsePostsQuery(url: URL): PostsQuery {
	const params = url.searchParams;
	const q = params.get('q') ?? '';
	const sortParam = params.get('sort');
	const sort =
		sortParam && postsSortSchema.safeParse(sortParam).success
			? (sortParam as PostsSort)
			: q
				? 'relevance'
				: 'date';

	const limitRaw = params.get('limit');
	return postsQuerySchema.parse({
		q,
		tag: params.get('tag') ?? '',
		sort,
		fuzzy: parseFuzzy(params.get('fuzzy')),
		limit: limitRaw ?? undefined
	});
}

export const blogSortSchema = z.enum(['date', 'title']);

export type BlogSort = z.infer<typeof blogSortSchema>;

export type BlogQuery = {
	page: number;
	tag: string;
	sort: BlogSort;
};

/** Parse blog listing page, tag, and sort from a URL. */
export function parseBlogQuery(url: URL): BlogQuery {
	const params = url.searchParams;
	const pageRaw = Number(params.get('page') ?? '1');
	const page = !Number.isFinite(pageRaw) || pageRaw < 1 ? 1 : Math.floor(pageRaw);
	const sortParam = params.get('sort');
	const sort =
		sortParam && blogSortSchema.safeParse(sortParam).success ? (sortParam as BlogSort) : 'date';

	return {
		page,
		tag: params.get('tag') ?? '',
		sort
	};
}

/** Serialize a blog query into non-default URLSearchParams. */
export function blogQueryToSearchParams(query: BlogQuery): URLSearchParams {
	const params = new URLSearchParams();
	if (query.tag) params.set('tag', query.tag);
	if (query.sort !== 'date') params.set('sort', query.sort);
	if (query.page > 1) params.set('page', String(query.page));
	return params;
}

/** Pathname (+ optional search) for the blog listing — pass through `resolve()` before `goto()`. */
export function blogQueryPath({ lang, query }: { lang: string; query: BlogQuery }): `/${string}` {
	const qs = blogQueryToSearchParams(query).toString();
	const path = `/${lang}/blog`;
	return (qs ? `${path}?${qs}` : path) as `/${string}`;
}
