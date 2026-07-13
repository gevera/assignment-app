export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: string | null | undefined): value is Theme {
	return value === 'light' || value === 'dark';
}

/** Resolve theme from storage, falling back to system preference. */
export function resolveTheme(stored: string | null | undefined): Theme {
	if (isTheme(stored)) return stored;
	if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	return 'light';
}

export function getStoredTheme(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(THEME_STORAGE_KEY);
}

export function applyTheme(theme: Theme): void {
	document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: Theme): void {
	applyTheme(theme);
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function toggleTheme(current: Theme): Theme {
	const next: Theme = current === 'light' ? 'dark' : 'light';
	setTheme(next);
	return next;
}

export function readDocumentTheme(): Theme {
	const attr = document.documentElement.dataset.theme;
	return isTheme(attr) ? attr : resolveTheme(getStoredTheme());
}
