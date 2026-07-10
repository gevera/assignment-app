import type { PageServerLoad } from './$types';
import { getAllItems } from '$lib/server';

export const load: PageServerLoad = ({ depends }) => {
	depends('app:items');

	return {
		items: Promise.resolve(getAllItems())
	};
};
