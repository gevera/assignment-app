import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	defaultLocale,
	getFirstPathSegment,
	isSupportedLocale,
	loadTranslations,
	LOCALE_PATTERN,
	locales,
	preferredLocale,
	translations
} from '$lib/i18n';
import { readSessionUser } from '$lib/server/session';

const META_PATHS = new Set(['/sitemap.xml', '/robots.txt']);

export const handle: Handle = async ({ event, resolve }) => {
	const { url, request, cookies } = event;
	const { pathname } = url;

	if (META_PATHS.has(pathname)) {
		return resolve(event);
	}

	const supported = locales.get().map((l) => l.toLowerCase());
	const segment = getFirstPathSegment(pathname);

	let lang: string;

	if (segment && isSupportedLocale({ segment, supported })) {
		lang = segment;
	} else if (segment && LOCALE_PATTERN.test(segment)) {
		lang = preferredLocale({ request, supported });
	} else {
		lang = preferredLocale({ request, supported });
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
