import Fuse from 'fuse.js';
import { match } from 'ts-pattern';
import type { Locale } from '$lib/i18n';
import type { Post } from '$lib/schemas';
import {
	POSTS_PER_PAGE,
	SEARCH_RECENT_LIMIT,
	type BlogQuery,
	type PostsQuery,
	type PostsSort
} from '$lib/utils/posts-query';
import { getPosts } from './data';
import { getAllTags } from './tags';

export type QueryPostsResult = {
	posts: Post[];
	total: number;
};

export type PagedPosts = {
	posts: Post[];
	total: number;
	page: number;
	perPage: number;
	pageCount: number;
};

/** Return every post from the in-memory data store. */
export function getAllPosts(): Post[] {
	return getPosts();
}

/** Look up a single post by its slug. */
export function getPostBySlug(slug: string): Post | undefined {
	return getPosts().find((post) => post.slug === slug);
}

/** Build localized tag text used for fuzzy search matching. */
function tagSearchText({ post, lang }: { post: Post; lang: Locale }): string {
	const tags = getAllTags();
	return post.tags
		.map((slug) => {
			const tag = tags.find((entry) => entry.slug === slug);
			return tag ? `${slug} ${tag.label[lang]}` : slug;
		})
		.join(' ');
}

/** Sort posts by date, localized title, or relevance fallback. */
function sortPosts({
	posts,
	sort,
	lang
}: {
	posts: Post[];
	sort: PostsSort;
	lang: Locale;
}): Post[] {
	return match(sort)
		.with('date', () => [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)))
		.with('title', () =>
			[...posts].sort((a, b) =>
				a.translations[lang].title.localeCompare(b.translations[lang].title, lang)
			)
		)
		.with('relevance', () => [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)))
		.exhaustive();
}

/** Return whether the post title, excerpt, or tags contain the needle. */
function matchesSubstring({
	post,
	needle,
	lang
}: {
	post: Post;
	needle: string;
	lang: Locale;
}): boolean {
	const translation = post.translations[lang];
	if (translation.title.toLowerCase().includes(needle)) return true;
	if (translation.excerpt.toLowerCase().includes(needle)) return true;

	const tags = getAllTags();
	return post.tags.some((slug) => {
		if (slug.toLowerCase().includes(needle)) return true;
		const tag = tags.find((entry) => entry.slug === slug);
		return tag?.label[lang].toLowerCase().includes(needle) ?? false;
	});
}

/** Filter, search, and optionally limit posts for the search API. */
export function queryPosts(input: PostsQuery & { lang: Locale }): QueryPostsResult {
	const lang = input.lang;
	let rows = [...getPosts()];

	if (input.tag) {
		rows = rows.filter((post) => post.tags.includes(input.tag));
	}

	const q = input.q.trim();

	if (!q) {
		rows = sortPosts({ posts: rows, sort: 'date', lang });
		const total = rows.length;
		const limit = input.tag ? (input.limit ?? total) : (input.limit ?? SEARCH_RECENT_LIMIT);
		return { posts: rows.slice(0, limit), total };
	}

	if (input.fuzzy) {
		const fuse = new Fuse(
			rows.map((post) => ({
				post,
				title: post.translations[lang].title,
				excerpt: post.translations[lang].excerpt,
				tags: tagSearchText({ post, lang })
			})),
			{
				keys: ['title', 'excerpt', 'tags'],
				threshold: 0.4,
				includeScore: true
			}
		);
		const hits = fuse.search(q);
		rows = hits.map((hit) => hit.item.post);
		if (input.sort !== 'relevance') {
			rows = sortPosts({ posts: rows, sort: input.sort, lang });
		}
	} else {
		const needle = q.toLowerCase();
		rows = rows.filter((post) => matchesSubstring({ post, needle, lang }));
		rows = sortPosts({
			posts: rows,
			sort: input.sort === 'relevance' ? 'date' : input.sort,
			lang
		});
	}

	const total = rows.length;
	const posts = input.limit != null ? rows.slice(0, input.limit) : rows;
	return { posts, total };
}

/** Return a sorted, tag-filtered page of posts for the blog listing. */
export function listPosts(input: BlogQuery & { lang: Locale }): PagedPosts {
	let rows = [...getPosts()];

	if (input.tag) {
		rows = rows.filter((post) => post.tags.includes(input.tag));
	}

	rows = sortPosts({ posts: rows, sort: input.sort, lang: input.lang });

	const total = rows.length;
	const pageCount = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
	const current = Math.min(Math.max(1, input.page), pageCount);
	const start = (current - 1) * POSTS_PER_PAGE;

	return {
		posts: rows.slice(start, start + POSTS_PER_PAGE),
		total,
		page: current,
		perPage: POSTS_PER_PAGE,
		pageCount
	};
}
