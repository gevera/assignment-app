import { isLocale } from '$lib/routing';

/**
 * @param {string} param
 * @return {param is ('en' | 'de')}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
	return isLocale(param);
}
