import { isLocale } from '$lib/i18n';

/**
 * @param {string} param
 * @return {param is ('en' | 'de')}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
	return isLocale(param);
}
