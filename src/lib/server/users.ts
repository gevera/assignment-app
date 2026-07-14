import type { User } from '$lib/schemas';
import { getUsers } from './data';

/** Return every user from the in-memory data store. */
export function getAllUsers(): User[] {
	return getUsers();
}
