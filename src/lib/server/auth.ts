import type { LoginInput, SessionUser } from '$lib/schemas';
import { getAllUsers } from './users';

export function authenticateUser({ email, password }: LoginInput): SessionUser | null {
	const user = getAllUsers().find((u) => u.email === email && u.password === password);
	if (!user) return null;

	const { id, name, role } = user;
	return { id, email, name, role };
}

type SafeRedirectArgs = {
	redirectTo: string | null | undefined;
	lang: string;
};

/** Only allow same-locale relative paths; reject open redirects. */
export function safeRedirectPath({ redirectTo, lang }: SafeRedirectArgs): string {
	const fallback = `/${lang}/dashboard`;
	if (!redirectTo) return fallback;

	if (
		!redirectTo.startsWith(`/${lang}/`) ||
		redirectTo.startsWith('//') ||
		redirectTo.includes('://')
	) {
		return fallback;
	}

	return redirectTo;
}
