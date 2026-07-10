import { describe, expect, it } from 'vitest';
import postsData from '../../../mocks/posts.json';
import itemsData from '../../../mocks/items.json';
import usersData from '../../../mocks/users.json';
import tagsData from '../../../mocks/tags.json';
import { getUsers } from './data';
import { parseItems, parsePosts, parseTags, parseUsers } from './parse';

describe('parse mock JSON', () => {
	it('parses posts.json', () => {
		const posts = parsePosts(postsData);
		expect(posts.length).toBeGreaterThan(0);
	});

	it('parses items.json', () => {
		const items = parseItems(itemsData);
		expect(items.length).toBeGreaterThan(0);
	});

	it('parses users.json', () => {
		const users = parseUsers(usersData);
		expect(users).toHaveLength(3);
	});

	it('parses tags.json', () => {
		const tags = parseTags(tagsData);
		expect(tags.length).toBeGreaterThan(0);
	});

	it('getUsers returns 3 demo users', () => {
		expect(getUsers()).toHaveLength(3);
	});

	it('fails fast on invalid mock data', () => {
		expect(() => parsePosts([{ id: 1 }])).toThrow();
	});
});
