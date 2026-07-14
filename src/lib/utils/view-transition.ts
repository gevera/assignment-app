import type { OnNavigate } from '@sveltejs/kit';
import { LOCALES } from '$lib/i18n';

export function pathWithoutLocale({
	pathname,
	locales = LOCALES
}: {
	pathname: string;
	locales?: readonly string[];
}): string {
	const segments = pathname.split('/').filter(Boolean);
	const head = segments[0];

	if (head && locales.includes(head)) {
		const rest = segments.slice(1).join('/');
		return rest ? `/${rest}` : '/';
	}

	return pathname;
}

export function isLocaleOnlyPathChange({
	from,
	to,
	locales = LOCALES
}: {
	from: string;
	to: string;
	locales?: readonly string[];
}): boolean {
	return (
		pathWithoutLocale({ pathname: from, locales }) === pathWithoutLocale({ pathname: to, locales })
	);
}

export type ViewTransitionEnvironment = {
	supportsViewTransitions: boolean;
	prefersReducedMotion: boolean;
};

export function shouldUseViewTransition({
	from,
	to,
	env,
	locales = LOCALES
}: {
	from: string | undefined;
	to: string | undefined;
	env: ViewTransitionEnvironment;
	locales?: readonly string[];
}): boolean {
	if (!env.supportsViewTransitions || env.prefersReducedMotion) return false;
	if (!from || !to || from === to) return false;
	return !isLocaleOnlyPathChange({ from, to, locales });
}

export function viewTransitionNavigation({
	navigation,
	startViewTransition
}: {
	navigation: OnNavigate;
	startViewTransition: NonNullable<Document['startViewTransition']>;
}): Promise<void> {
	return new Promise((resolve) => {
		startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
}
