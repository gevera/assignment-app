import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Serve robots.txt allowing crawl and pointing at the sitemap. */
export const GET: RequestHandler = () => {
	const body = ['User-agent: *', 'Disallow:', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join(
		'\n'
	);

	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
