/**
 * Rewrites the SSR/prerender HTML chunk before it is sent to the client.
 */
export function transformPageHtml({ html, lang }: { html: string; lang: string }): string {
	return html
		.replace(/<html[^>]*>/, `<html lang="${lang}">`)
		.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');
}
