import i18n, { type Config } from 'sveltekit-i18n';
import { DEFAULT_LOCALE } from './locales';
import { resolve } from '$app/paths';

function nestFlatKeys(flat: Record<string, string>): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(flat)) {
		const parts = key.split('.');
		let current = result;

		for (let i = 0; i < parts.length - 1; i++) {
			current[parts[i]] ??= {};
			current = current[parts[i]] as Record<string, unknown>;
		}

		current[parts.at(-1)!] = value;
	}

	return result;
}

const config: Config = {
	loaders: [
		{
			locale: 'en',
			key: 'i18n',
			loader: async () => nestFlatKeys((await import('../../../mocks/i18n.en.json')).default)
		},
		{
			locale: 'de',
			key: 'i18n',
			loader: async () => nestFlatKeys((await import('../../../mocks/i18n.de.json')).default)
		}
	]
};

export const localizedPath = ({ lang, path }: { lang: string; path: string }) => {
	return resolve(path ? `/${lang}${path}` : `/${lang}`);
};

export { DEFAULT_LOCALE as defaultLocale };
export * from './locales';
export * from './path';

export const {
	t,
	locale,
	locales,
	loading,
	loadTranslations,
	translations,
	setRoute,
	setLocale,
	addTranslations
} = new i18n(config);
