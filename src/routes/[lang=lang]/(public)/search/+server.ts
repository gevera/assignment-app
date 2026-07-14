import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DEFAULT_LOCALE, isLocale } from '$lib/i18n';
import { queryPosts } from '$lib/server';
import { parsePostsQuery } from '$lib/utils/posts-query';

export const prerender = false;

export const config: Config = {
	runtime: 'edge',
	split: true
};

/** JSON search endpoint returning filtered/sorted posts for the dialog. */
export const GET: RequestHandler = ({ url, params }) => {
	const lang = params.lang && isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
	const query = parsePostsQuery(url);
	return json(queryPosts({ ...query, lang }));
};
