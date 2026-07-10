import { addTranslations, setLocale, setRoute } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, url, params }) => {
	const { lang, translations: initial, user } = data;
	const route = url.pathname.replace(new RegExp(`^/${params.lang}`), '');

	addTranslations(initial);
	await setRoute(route);
	await setLocale(lang);

	return { lang, user };
};
