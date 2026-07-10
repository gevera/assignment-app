import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { getAllPosts, getPostBySlug } from '$lib/server';
import { LOCALES } from '$lib/i18n';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const posts = getAllPosts();

	return LOCALES.flatMap((lang) => posts.map((post) => ({ lang, slug: post.slug })));
};

export const load: PageServerLoad = ({ params, depends }) => {
	depends('app:posts');

	const post = getPostBySlug(params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	return { post };
};
