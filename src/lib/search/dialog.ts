import { pushState, replaceState } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { postsQueryPath, type PostsQuery, type PostsSort } from '$lib/utils/posts-query-path';

export type SearchFilters = {
	q?: string;
	tag?: string;
	sort?: PostsSort;
	fuzzy?: boolean;
};

/** Return the active lang route param, defaulting to English. */
function currentLang(): string {
	return page.params.lang ?? 'en';
}

/** Locale-less path to restore when the search dialog closes. */
function currentReturnPath(): string {
	if (page.state.searchReturnPath != null) return page.state.searchReturnPath;
	const stripped = page.url.pathname.replace(new RegExp(`^/${currentLang()}`), '') || '';
	return stripped === '/search' ? '' : stripped;
}

/** Normalize optional search filters into a full PostsQuery. */
export function filtersToQuery(filters: SearchFilters = {}): PostsQuery {
	const q = filters.q ?? '';
	return {
		q,
		tag: filters.tag ?? '',
		sort: filters.sort ?? (q ? 'relevance' : 'date'),
		fuzzy: filters.fuzzy ?? false
	};
}

/** Open the search dialog via history state and the search URL. */
export function openSearchDialog(filters: SearchFilters = {}): void {
	const query = filtersToQuery(filters);
	pushState(resolve(postsQueryPath({ lang: currentLang(), query })), {
		searchOpen: true,
		searchReturnPath: currentReturnPath()
	});
}

/** Update the search dialog URL while keeping the dialog open in history state. */
export function syncSearchDialogUrl(query: PostsQuery): void {
	replaceState(resolve(postsQueryPath({ lang: currentLang(), query })), {
		searchOpen: true,
		searchReturnPath: currentReturnPath()
	});
}

/** Close the search dialog by stepping back in history when it is open. */
export function closeSearchDialog(): void {
	if (page.state.searchOpen) {
		history.back();
	}
}
