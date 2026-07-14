import { DEFAULT_LOCALE, LOCALES } from '$lib/i18n/locales';

export type SitemapEntry = {
	/** Locale-less path, e.g. '' (home), '/blog', '/blog/some-slug'. */
	path: string;
	/** ISO date (YYYY-MM-DD) of the last content change, if known. */
	lastmod?: string;
};

/** Escape a string for safe inclusion in XML text or attributes. */
function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

/** Build a multilingual sitemap XML document for the given entries. */
export function buildSitemapXml({
	siteUrl,
	entries
}: {
	siteUrl: string;
	entries: SitemapEntry[];
}): string {
	const urls = entries.flatMap((entry) => {
		const alternates = [
			...LOCALES.map((locale) => ({
				hreflang: locale as string,
				href: `${siteUrl}/${locale}${entry.path}`
			})),
			{ hreflang: 'x-default', href: `${siteUrl}/${DEFAULT_LOCALE}${entry.path}` }
		];

		return LOCALES.map((locale) =>
			[
				'\t<url>',
				`\t\t<loc>${escapeXml(`${siteUrl}/${locale}${entry.path}`)}</loc>`,
				...alternates.map(
					(alternate) =>
						`\t\t<xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`
				),
				...(entry.lastmod ? [`\t\t<lastmod>${entry.lastmod}</lastmod>`] : []),
				'\t</url>'
			].join('\n')
		);
	});

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...urls,
		'</urlset>',
		''
	].join('\n');
}
