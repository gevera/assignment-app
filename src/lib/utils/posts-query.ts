import { z } from 'zod';

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

export type PostsQuery = z.infer<typeof postsQuerySchema>;
export type PostsSort = z.infer<typeof postsSortSchema>;

function parseFuzzy(value: string | null): boolean {
	return value === '1' || value === 'true';
}

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

export function postsQueryToSearchParams(query: PostsQuery): URLSearchParams {
	const params = new URLSearchParams();
	const defaultSort = query.q ? 'relevance' : 'date';

	if (query.q) params.set('q', query.q);
	if (query.tag) params.set('tag', query.tag);
	if (query.sort !== defaultSort) params.set('sort', query.sort);
	if (query.fuzzy) params.set('fuzzy', '1');
	if (query.limit != null) params.set('limit', String(query.limit));

	return params;
}

/** Pathname (+ optional search) for the search API — pass through `resolve()` before fetch/goto. */
export function postsQueryPath({ lang, query }: { lang: string; query: PostsQuery }): `/${string}` {
	const qs = postsQueryToSearchParams(query).toString();
	const path = `/${lang}/search`;
	return (qs ? `${path}?${qs}` : path) as `/${string}`;
}

export const blogSortSchema = z.enum(['date', 'title']);

export type BlogSort = z.infer<typeof blogSortSchema>;

export type BlogQuery = {
	page: number;
	tag: string;
	sort: BlogSort;
};

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
