import { DEFAULT_LOCALE } from './locales';

export const LOCALE_PATTERN = /^[a-z]{2}(-[a-z]{2})?$/i;

export function getFirstPathSegment(pathname: string): string | undefined {
	return pathname.match(/[^/]+?(?=\/|$)/)?.[0]?.toLowerCase();
}

export function isSupportedLocale({
	segment,
	supported
}: {
	segment: string | undefined;
	supported: string[];
}): boolean {
	return Boolean(segment && supported.includes(segment));
}

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
