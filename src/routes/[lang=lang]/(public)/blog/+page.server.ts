import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad } from './$types';
import { listPosts } from '$lib/server';
import { getAllTags } from '$lib/server';
import type { Locale } from '$lib/i18n';
import { parseBlogQuery } from '$lib/utils/posts-query';

export const prerender = false;

export const config: Config = {
	isr: { expiration: 300 }
};

export const load: PageServerLoad = ({ url, params, depends }) => {
	depends('app:posts');
	depends('app:tags');
	const query = parseBlogQuery(url);
	const lang = params.lang as Locale;
	return {
		...listPosts({ ...query, lang }),
		query,
		tags: getAllTags()
	};
};
