import { pushState, replaceState } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { postsQueryPath, type PostsQuery, type PostsSort } from '$lib/utils/posts-query';

export type SearchFilters = {
	q?: string;
	tag?: string;
	sort?: PostsSort;
	fuzzy?: boolean;
};

function currentLang(): string {
	return page.params.lang ?? 'en';
}

function currentReturnPath(): string {
	if (page.state.searchReturnPath != null) return page.state.searchReturnPath;
	const stripped = page.url.pathname.replace(new RegExp(`^/${currentLang()}`), '') || '';
	return stripped === '/search' ? '' : stripped;
}

export function filtersToQuery(filters: SearchFilters = {}): PostsQuery {
	const q = filters.q ?? '';
	return {
		q,
		tag: filters.tag ?? '',
		sort: filters.sort ?? (q ? 'relevance' : 'date'),
		fuzzy: filters.fuzzy ?? false
	};
}

export function openSearchDialog(filters: SearchFilters = {}): void {
	const query = filtersToQuery(filters);
	pushState(resolve(postsQueryPath({ lang: currentLang(), query })), {
		searchOpen: true,
		searchReturnPath: currentReturnPath()
	});
}

export function syncSearchDialogUrl(query: PostsQuery): void {
	replaceState(resolve(postsQueryPath({ lang: currentLang(), query })), {
		searchOpen: true,
		searchReturnPath: currentReturnPath()
	});
}

export function closeSearchDialog(): void {
	if (page.state.searchOpen) {
		history.back();
	}
}
