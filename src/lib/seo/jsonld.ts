import { SITE_NAME } from './site';

/** Build Organization JSON-LD for the site. */
export function organizationJsonLd({ siteUrl }: { siteUrl: string }): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: siteUrl,
		logo: `${siteUrl}/favicon.svg`
	};
}

/** Build Article JSON-LD for a blog post page. */
export function articleJsonLd({
	url,
	headline,
	description,
	datePublished,
	authorName
}: {
	url: string;
	headline: string;
	description: string;
	datePublished: string;
	authorName: string;
}): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline,
		description,
		datePublished,
		author: { '@type': 'Person', name: authorName },
		mainEntityOfPage: { '@type': 'WebPage', '@id': url }
	};
}

/** Build BreadcrumbList JSON-LD from ordered name/url crumbs. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

/** Serialize JSON-LD into a safe inline script element string. */
export function jsonLdScript(data: Record<string, unknown>): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
