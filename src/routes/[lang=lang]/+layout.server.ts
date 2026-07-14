import { loadTranslations, translations } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

/** Load translations and pass lang, catalog, and user into the locale layout. */
export const load: LayoutServerLoad = async ({ params, locals: { user } }) => {
	const { lang } = params;

	await loadTranslations(lang, '');

	return { lang, translations: translations.get(), user };
};
