import type { Item } from '$lib/schemas';
import { getItems } from './data';

export function getAllItems(): Item[] {
	return getItems();
}
