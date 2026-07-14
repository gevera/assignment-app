import type { ParamMatcher } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';

/** Match a supported locale path param. */
export const match = ((param: string): param is 'en' | 'de' => {
	return isLocale(param);
}) satisfies ParamMatcher;
