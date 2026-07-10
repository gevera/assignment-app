import { loadTranslations, translations } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const { pathname } = url;
	const { lang } = locals;

	const route = pathname.replace(new RegExp(`^/${lang}`), '');

	await loadTranslations(lang, route);

	return { i18n: { route, lang }, translations: translations.get() };
};
