import type { Post } from '$lib/schemas';
import { getPosts } from './data';

export function getAllPosts(): Post[] {
	return getPosts();
}

export function getPostBySlug(slug: string): Post | undefined {
	return getPosts().find((post) => post.slug === slug);
}
