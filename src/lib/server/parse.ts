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

export function parsePosts(data: unknown): Post[] {
	return z.array(postSchema).parse(data);
}

export function parseItems(data: unknown): Item[] {
	return z.array(itemSchema).parse(data);
}

export function parseUsers(data: unknown): User[] {
	return z.array(userSchema).parse(data);
}

export function parseTags(data: unknown): Tag[] {
	return z.array(tagSchema).parse(data);
}
