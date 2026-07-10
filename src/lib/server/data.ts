import postsData from '../../../mocks/posts.json';
import itemsData from '../../../mocks/items.json';
import usersData from '../../../mocks/users.json';
import tagsData from '../../../mocks/tags.json';
import type { Item, Post, Tag, User } from '$lib/schemas';
import { parseItems, parsePosts, parseTags, parseUsers } from './parse';

let posts: Post[] | undefined;
let items: Item[] | undefined;
let users: User[] | undefined;
let tags: Tag[] | undefined;

export function getPosts(): Post[] {
	posts ??= parsePosts(postsData);
	return posts;
}

export function getItems(): Item[] {
	items ??= parseItems(itemsData);
	return items;
}

export function getUsers(): User[] {
	users ??= parseUsers(usersData);
	return users;
}

export function getTags(): Tag[] {
	tags ??= parseTags(tagsData);
	return tags;
}
