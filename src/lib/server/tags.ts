import type { Tag } from '$lib/schemas';
import { getTags } from './data';

export function getAllTags(): Tag[] {
	return getTags();
}
