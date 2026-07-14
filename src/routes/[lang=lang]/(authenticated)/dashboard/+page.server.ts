import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** Redirect authenticated users to the items dashboard. */
export const load: PageServerLoad = ({ locals: { user }, params: { lang } }) => {
	if (!user) {
		redirect(303, '/login');
	}
	redirect(303, `/${lang}/dashboard/items`);
};
