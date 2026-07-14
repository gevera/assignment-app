import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { getAllPosts, getAllTags, getPostBySlug } from '$lib/server';
import { LOCALES } from '$lib/i18n';

export const prerender = true;

/** Enumerate prerender entries for every locale and post slug. */
export const entries: EntryGenerator = () => {
	const posts = getAllPosts();

	return LOCALES.flatMap((lang) => posts.map(({ slug }) => ({ lang, slug })));
};

/** Load a single blog post and its tags, or 404. */
export const load: PageServerLoad = ({ params: { slug }, depends }) => {
	depends('app:posts');
	depends('app:tags');

	const post = getPostBySlug(slug);

	if (!post) {
		error(404, 'Post not found');
	}

	return { post, tags: getAllTags() };
};
