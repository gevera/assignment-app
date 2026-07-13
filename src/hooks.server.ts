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
import { classifyLocaleSegment, resolveLocaleRouting } from '$lib/utils';

const META_PATHS = new Set(['/sitemap.xml', '/robots.txt']);

export const handle: Handle = async ({ event, resolve }) => {
	const { url, request, cookies } = event;
	const { pathname } = url;

	if (META_PATHS.has(pathname)) {
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
		transformPageChunk: ({ html }) => html.replace(/<html[^>]*>/, `<html lang="${lang}">`)
	});
};

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
