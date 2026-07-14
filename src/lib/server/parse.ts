import { z } from 'zod';
import {
	itemSchema,
	postSchema,
	tagSchema,
	userSchema,
	type Item,
	type Post,
	type Tag,
	type User
} from '$lib/schemas';

/** Validate unknown data as an array of posts. */
export function parsePosts(data: unknown): Post[] {
	return z.array(postSchema).parse(data);
}

/** Validate unknown data as an array of items. */
export function parseItems(data: unknown): Item[] {
	return z.array(itemSchema).parse(data);
}

/** Validate unknown data as an array of users. */
export function parseUsers(data: unknown): User[] {
	return z.array(userSchema).parse(data);
}

/** Validate unknown data as an array of tags. */
export function parseTags(data: unknown): Tag[] {
	return z.array(tagSchema).parse(data);
}
