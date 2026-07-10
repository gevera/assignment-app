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

export const handle: Handle = async ({ event, resolve }) => {
	const { url, request } = event;
	const { pathname } = url;

	const supportedLocales = locales.get().map((l) => l.toLowerCase());
	const firstSegment = getFirstPathSegment(pathname);

	let lang: string;

	if (isSupportedLocale(firstSegment, supportedLocales)) {
		lang = firstSegment;
	} else if (firstSegment && LOCALE_PATTERN.test(firstSegment)) {
		// Invalid locale like /br/… — `reroute` maps into [lang]/[...path] for a custom 404.
		lang = preferredLocale(request, supportedLocales);
	} else {
		lang = preferredLocale(request, supportedLocales);
		redirect(307, `/${lang}${pathname === '/' ? '' : pathname}${url.search}`);
	}

	return resolve(
		{ ...event, locals: { lang } },
		{
			transformPageChunk: ({ html }) => html.replace(/<html[^>]*>/, `<html lang="${lang}">`)
		}
	);
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
