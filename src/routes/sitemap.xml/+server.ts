import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/server';
import { SITE_URL } from '$lib/seo';
import { buildSitemapXml } from '$lib/seo/sitemap';

export const prerender = true;

/** Serve the multilingual XML sitemap for home, blog, and posts. */
export const GET: RequestHandler = () => {
	const posts = getAllPosts();

	const xml = buildSitemapXml({
		siteUrl: SITE_URL,
		entries: [
			{ path: '' },
			{ path: '/blog' },
			...posts.map((post) => ({
				path: `/blog/${post.slug}`,
				lastmod: post.publishedAt.slice(0, 10)
			}))
		]
	});

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
