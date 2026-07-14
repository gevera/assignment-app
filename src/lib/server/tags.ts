import type { Tag } from '$lib/schemas';
import { getTags } from './data';

/** Return every tag from the in-memory data store. */
export function getAllTags(): Tag[] {
	return getTags();
}
