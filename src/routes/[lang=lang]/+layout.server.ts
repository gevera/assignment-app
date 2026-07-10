import { loadTranslations, translations } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const { lang } = params;

	await loadTranslations(lang, '');

	return { lang, translations: translations.get() };
};
