const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * @param {string} param
 * @return {param is string}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
	return SLUG_PATTERN.test(param);
}
