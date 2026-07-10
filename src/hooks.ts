import type { Reroute } from '@sveltejs/kit';
import { DEFAULT_LOCALE, getFirstPathSegment, LOCALES, LOCALE_PATTERN } from '$lib/i18n';

const SUPPORTED = new Set(LOCALES.map((l) => l.toLowerCase()));

export const reroute: Reroute = ({ url }) => {
	const first = getFirstPathSegment(url.pathname);
	if (first && LOCALE_PATTERN.test(first) && !SUPPORTED.has(first)) {
		return `/${DEFAULT_LOCALE}${url.pathname}`;
	}
};
