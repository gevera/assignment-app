import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad } from './$types';
import { listPosts } from '$lib/server';
import { getAllTags } from '$lib/server';
import type { Locale } from '$lib/i18n';
import { parseBlogQuery } from '$lib/utils/posts-query';

export const prerender = false;

export const config: Config = {
	runtime: 'nodejs24.x',
	split: true,
	isr: {
		expiration: 300,
		allowQuery: ['tag', 'sort', 'page']
	}
};

/** Load a paginated blog listing with tags for the toolbar. */
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
