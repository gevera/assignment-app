import { error } from '@sveltejs/kit';
import { isLocale, type Locale } from '$lib/routing/locales';

export const load = async ({ params }) => {
	const lang = params.lang;
	if (!isLocale(lang)) error(404, 'Not Found');

	return {
		lang: lang as Locale
	};
};
