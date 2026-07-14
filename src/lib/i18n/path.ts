import { DEFAULT_LOCALE } from './locales';

export const LOCALE_PATTERN = /^[a-z]{2}(-[a-z]{2})?$/i;

/** Return the first non-empty segment of a pathname, lowercased. */
export function getFirstPathSegment(pathname: string): string | undefined {
	return pathname.match(/[^/]+?(?=\/|$)/)?.[0]?.toLowerCase();
}

/** Return whether the segment is one of the supported locale codes. */
export function isSupportedLocale({
	segment,
	supported
}: {
	segment: string | undefined;
	supported: string[];
}): boolean {
	return Boolean(segment && supported.includes(segment));
}

/** Pick a preferred locale from Accept-Language, falling back to the default. */
export function preferredLocale({
	request,
	supported
}: {
	request: Request;
	supported: string[];
}): string {
	const fromHeader =
		`${request.headers.get('accept-language')}`
			.match(/[a-zA-Z]+?(?=-|_|,|;)/)?.[0]
			?.toLowerCase() ?? DEFAULT_LOCALE;

	return supported.includes(fromHeader) ? fromHeader : DEFAULT_LOCALE;
}
