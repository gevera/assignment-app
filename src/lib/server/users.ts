import type { User } from '$lib/schemas';
import { getUsers } from './data';

export function getAllUsers(): User[] {
	return getUsers();
}
