import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

export const load: LayoutServerLoad = async ({
	locals: { user },
	params: { lang },
	url: { pathname, search }
}) => {
	if (!user) {
		const redirectTo = encodeURIComponent(pathname + search);
		redirect(303, `/${lang}/login?redirect=${redirectTo}`);
	}

	return { user };
};
