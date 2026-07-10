import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad } from './$types';
import { getAllPosts, getAllTags } from '$lib/server';

export const prerender = false;

export const config: Config = {
	runtime: 'edge'
};

export const load: PageServerLoad = ({ depends }) => {
	depends('app:posts');
	depends('app:tags');

	return {
		posts: getAllPosts(),
		tags: getAllTags()
	};
};
