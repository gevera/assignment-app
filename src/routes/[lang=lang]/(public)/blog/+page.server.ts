import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/server';

export const prerender = false;

export const config: Config = {
	isr: { expiration: 300 }
};

export const load: PageServerLoad = ({ depends }) => {
	depends('app:posts');
	return { posts: getAllPosts() };
};
