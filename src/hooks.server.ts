import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	defaultLocale,
	getFirstPathSegment,
	loadTranslations,
	locales,
	preferredLocale,
	translations
} from '$lib/i18n';
import { readSessionUser } from '$lib/server/session';
import { classifyLocaleSegment, resolveLocaleRouting } from '$lib/utils/matchers';

const META_PATHS = new Set(['/sitemap.xml', '/robots.txt']);

/** Resolve locale, session locals, and html lang for every non-meta request. */
export const handle: Handle = async ({ event, resolve }) => {
	const { url, request, cookies } = event;
	const { pathname } = url;

	// API routes live outside the locale segment; skip locale routing entirely.
	if (META_PATHS.has(pathname) || pathname.startsWith('/api/')) {
		return resolve(event);
	}

	const supported = locales.get().map((l) => l.toLowerCase());
	const segment = getFirstPathSegment(pathname);
	const preferred = preferredLocale({ request, supported });
	const { lang, shouldRedirect } = resolveLocaleRouting({
		kind: classifyLocaleSegment({ segment, supported }),
		preferred
	});

	if (shouldRedirect) {
		redirect(307, `/${lang}${pathname === '/' ? '' : pathname}${url.search}`);
	}

	const user = await readSessionUser(cookies);
	event.locals.lang = lang;
	event.locals.user = user;

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			let next = html
				.replace(/<html[^>]*>/, `<html lang="${lang}">`)
				// Drop modulepreloads so CSS wins the bandwidth race on slow mobile (LCP).
				.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');

			// Apply the full stylesheet without blocking first paint — critical CSS in
			// app.html paints LCP text immediately.
			next = next.replace(/<link\b[^>]*>/gi, (tag) => {
				if (!/\brel=["']stylesheet["']/i.test(tag)) return tag;
				const href = /\bhref=["']([^"']+)["']/i.exec(tag)?.[1];
				if (!href?.includes('.css')) return tag;
				return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
			});

			return next;
		}
	});
};

/** Load error-page translations and return a localized error payload. */
export const handleError: HandleServerError = async ({ error, event, message }) => {
	console.error(error);

	const lang = event.locals.lang ?? defaultLocale;

	await loadTranslations(lang, 'error');

	return {
		message,
		lang,
		translations: translations.get()
	};
};
