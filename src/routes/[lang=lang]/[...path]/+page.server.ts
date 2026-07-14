import { error } from '@sveltejs/kit';

/** Catch-all locale path that always returns a 404. */
export const load = () => {
	error(404, 'Not Found');
};
