export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Type guard for a supported locale code. */
export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}
