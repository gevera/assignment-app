import { describe, expect, it } from 'vitest';
import { buildSitemapXml } from './sitemap';

const siteUrl = 'https://example.com';

describe('buildSitemapXml', () => {
	it('emits one <url> per locale per entry', () => {
		const xml = buildSitemapXml({ siteUrl, entries: [{ path: '' }, { path: '/blog' }] });

		expect(xml.match(/<url>/g)).toHaveLength(4);
		expect(xml).toContain('<loc>https://example.com/en</loc>');
		expect(xml).toContain('<loc>https://example.com/de</loc>');
		expect(xml).toContain('<loc>https://example.com/en/blog</loc>');
		expect(xml).toContain('<loc>https://example.com/de/blog</loc>');
	});

	it('lists en, de and x-default alternates on every url', () => {
		const xml = buildSitemapXml({ siteUrl, entries: [{ path: '/blog' }] });

		expect(xml.match(/hreflang="en" href="https:\/\/example.com\/en\/blog"/g)).toHaveLength(2);
		expect(xml.match(/hreflang="x-default" href="https:\/\/example.com\/en\/blog"/g)).toHaveLength(
			2
		);
	});

	it('includes lastmod only when provided', () => {
		const xml = buildSitemapXml({
			siteUrl,
			entries: [{ path: '/blog/a', lastmod: '2026-05-31' }, { path: '/blog/b' }]
		});

		expect(xml.match(/<lastmod>2026-05-31<\/lastmod>/g)).toHaveLength(2);
		expect(xml.match(/<lastmod>/g)).toHaveLength(2);
	});

	it('escapes XML-special characters in urls', () => {
		const xml = buildSitemapXml({ siteUrl, entries: [{ path: '/blog/a&b' }] });

		expect(xml).toContain('/blog/a&amp;b');
		expect(xml).not.toContain('a&b');
	});

	it('declares the xhtml namespace for alternate links', () => {
		const xml = buildSitemapXml({ siteUrl, entries: [] });

		expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
	});
});
