import type { ParamMatcher } from '@sveltejs/kit';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Match a kebab-case blog post slug path param. */
export const match = ((param: string): boolean => {
	return SLUG_PATTERN.test(param);
}) satisfies ParamMatcher;
