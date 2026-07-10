import { addTranslations, setLocale, setRoute } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	const { i18n, translations: initial } = data;

	addTranslations(initial);
	await setRoute(i18n.route);
	await setLocale(i18n.lang);

	return i18n;
};
