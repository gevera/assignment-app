import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = ['User-agent: *', 'Disallow:', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');

	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
