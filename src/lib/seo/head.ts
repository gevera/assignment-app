import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '$lib/i18n/locales';

export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', de: 'de_DE' };

export const OG_IMAGE = { width: 1200, height: 630 } as const;

export type AlternateLink = { hreflang: string; href: string };

/** Replace the locale segment in a pathname with another language code. */
export function swapLangInPath({ pathname, lang }: { pathname: string; lang: string }): string {
	const segments = pathname.split('/');
	if (segments.length > 1 && isLocale(segments[1])) {
		segments[1] = lang;
		return segments.join('/');
	}
	return `/${lang}${pathname === '/' ? '' : pathname}`;
}

/** Build an absolute canonical URL from the site origin and pathname. */
export function canonicalUrl({ siteUrl, pathname }: { siteUrl: string; pathname: string }): string {
	const base = siteUrl.replace(/\/$/, '');
	const path = pathname === '/' ? '' : pathname.replace(/\/$/, '');
	return `${base}${path}`;
}

/** Build hreflang alternate links for every locale plus x-default. */
export function alternateLinks({
	siteUrl,
	pathname
}: {
	siteUrl: string;
	pathname: string;
}): AlternateLink[] {
	const perLocale: AlternateLink[] = LOCALES.map((locale) => ({
		hreflang: locale,
		href: canonicalUrl({ siteUrl, pathname: swapLangInPath({ pathname, lang: locale }) })
	}));

	return [
		...perLocale,
		{
			hreflang: 'x-default',
			href: canonicalUrl({ siteUrl, pathname: swapLangInPath({ pathname, lang: DEFAULT_LOCALE }) })
		}
	];
}
