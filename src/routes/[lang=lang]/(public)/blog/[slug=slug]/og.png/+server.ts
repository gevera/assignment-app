import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';
import { getAllPosts, getPostBySlug } from '$lib/server';
import { DEFAULT_LOCALE, LOCALES, isLocale } from '$lib/i18n';
import { OG_IMAGE, SITE_NAME } from '$lib/seo';
import serif600 from '@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff';
import sans400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const posts = getAllPosts();

	return LOCALES.flatMap((lang) => posts.map(({ slug }) => ({ lang, slug })));
};

/* Light-theme design tokens from src/routes/layout.css — satori has no CSS-variable support. */
const surface = '#f7f5f2';
const fg = '#1a1917';
const fgMuted = '#6b6560';
const border = '#e4dfd8';

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

export const GET: RequestHandler = async ({ params }) => {
	const post = getPostBySlug(params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
	const { title } = post.translations[lang];
	const date = new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(
		new Date(post.publishedAt)
	);

	const [serifData, sansData] = await Promise.all([
		read(serif600).arrayBuffer(),
		read(sans400).arrayBuffer()
	]);

	const markup = html`
		<div
			style="display: flex; flex-direction: column; justify-content: space-between; width: ${OG_IMAGE.width}px; height: ${OG_IMAGE.height}px; padding: 72px; background: ${surface}; color: ${fg}; font-family: 'IBM Plex Sans';"
		>
			<div
				style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 40px; border-bottom: 2px solid ${border};"
			>
				<div style="font-family: 'Source Serif 4'; font-size: 40px; font-weight: 600;">
					${escapeHtml(SITE_NAME)}
				</div>
				<div style="font-size: 28px; color: ${fgMuted};">Blog</div>
			</div>
			<div
				style="font-family: 'Source Serif 4'; font-size: 64px; font-weight: 600; line-height: 1.15; letter-spacing: -0.02em;"
			>
				${escapeHtml(title)}
			</div>
			<div style="display: flex; font-size: 28px; color: ${fgMuted};">
				${escapeHtml(`${post.author.name} · ${date}`)}
			</div>
		</div>
	`;

	const svg = await satori(markup, {
		width: OG_IMAGE.width,
		height: OG_IMAGE.height,
		fonts: [
			{ name: 'Source Serif 4', data: serifData, weight: 600, style: 'normal' },
			{ name: 'IBM Plex Sans', data: sansData, weight: 400, style: 'normal' }
		]
	});

	const png = new Resvg(svg).render().asPng();

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
