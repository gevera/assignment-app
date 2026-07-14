import { describe, expect, it } from 'vitest';
import { transformPageHtml } from './transform-page-html';

describe('transformPageHtml', () => {
	it('sets the html lang attribute', () => {
		const html = transformPageHtml({
			html: '<html><head></head><body></body></html>',
			lang: 'de'
		});
		expect(html).toContain('<html lang="de">');
	});

	it('strips modulepreload links so CSS can win the bandwidth race', () => {
		const html = transformPageHtml({
			html: `<html><head>
<link rel="modulepreload" href="/_app/immutable/entry/start.js">
<link rel="stylesheet" href="/_app/immutable/assets/0.css">
</head><body></body></html>`,
			lang: 'en'
		});

		expect(html).not.toContain('modulepreload');
		expect(html).toContain('<link rel="stylesheet" href="/_app/immutable/assets/0.css">');
	});

	it('does not make stylesheets non-blocking (async CSS causes CLS)', () => {
		const html = transformPageHtml({
			html: `<html><head>
<link rel="stylesheet" href="/_app/immutable/assets/0.css">
</head><body></body></html>`,
			lang: 'en'
		});

		expect(html).not.toMatch(/rel=["']preload["'][^>]*as=["']style["']/);
		expect(html).not.toContain("this.rel='stylesheet'");
		expect(html).toContain('<link rel="stylesheet" href="/_app/immutable/assets/0.css">');
	});
});
