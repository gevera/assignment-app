/** Path builders + types with no zod — safe for the public shell (Navbar / search dialog state). */

export type PostsSort = 'relevance' | 'date' | 'title';

export type PostsQuery = {
	q: string;
	tag: string;
	sort: PostsSort;
	fuzzy: boolean;
	limit?: number;
};

/** Serialize a posts search query into non-default URLSearchParams. */
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
