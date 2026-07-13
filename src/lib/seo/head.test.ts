import { describe, expect, it } from 'vitest';
import { alternateLinks, canonicalUrl, swapLangInPath } from './head';
import { jsonLdScript, organizationJsonLd } from './jsonld';

const siteUrl = 'https://example.com';

describe('swapLangInPath', () => {
	it('swaps the locale segment on the home path', () => {
		expect(swapLangInPath({ pathname: '/en', lang: 'de' })).toBe('/de');
	});

	it('swaps the locale segment on nested paths', () => {
		expect(swapLangInPath({ pathname: '/en/blog/some-post', lang: 'de' })).toBe(
			'/de/blog/some-post'
		);
	});

	it('keeps the path when the target locale is already active', () => {
		expect(swapLangInPath({ pathname: '/de/blog', lang: 'de' })).toBe('/de/blog');
	});

	it('prefixes the locale when the path has no locale segment', () => {
		expect(swapLangInPath({ pathname: '/health', lang: 'en' })).toBe('/en/health');
		expect(swapLangInPath({ pathname: '/', lang: 'en' })).toBe('/en');
	});
});

describe('canonicalUrl', () => {
	it('joins site URL and pathname without trailing slash', () => {
		expect(canonicalUrl({ siteUrl, pathname: '/en/blog/' })).toBe('https://example.com/en/blog');
	});

	it('tolerates a trailing slash on the site URL', () => {
		expect(canonicalUrl({ siteUrl: 'https://example.com/', pathname: '/en' })).toBe(
			'https://example.com/en'
		);
	});

	it('collapses the bare root path', () => {
		expect(canonicalUrl({ siteUrl, pathname: '/' })).toBe('https://example.com');
	});
});

describe('alternateLinks', () => {
	it('returns one link per locale plus x-default', () => {
		const links = alternateLinks({ siteUrl, pathname: '/en/blog' });

		expect(links).toEqual([
			{ hreflang: 'en', href: 'https://example.com/en/blog' },
			{ hreflang: 'de', href: 'https://example.com/de/blog' },
			{ hreflang: 'x-default', href: 'https://example.com/en/blog' }
		]);
	});

	it('points x-default at the default locale variant', () => {
		const links = alternateLinks({ siteUrl, pathname: '/de' });
		const xDefault = links.find((link) => link.hreflang === 'x-default');

		expect(xDefault?.href).toBe('https://example.com/en');
	});
});

describe('jsonLdScript', () => {
	it('wraps data in an application/ld+json script tag', () => {
		expect(jsonLdScript({ '@type': 'Organization' })).toBe(
			'<script type="application/ld+json">{"@type":"Organization"}</script>'
		);
	});

	it('escapes < so values cannot break out of the script tag', () => {
		expect(jsonLdScript({ name: '</script><img>' })).not.toContain('</script><img>');
		expect(jsonLdScript({ name: '</script>' })).toContain('\\u003c/script>');
	});

	it('builds an Organization entity from the site URL', () => {
		expect(organizationJsonLd({ siteUrl })).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			url: siteUrl,
			logo: 'https://example.com/favicon.svg'
		});
	});
});
