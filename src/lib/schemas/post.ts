import { z } from 'zod';
import { LOCALES } from '$lib/i18n';

export const localeSchema = z.enum(LOCALES);

export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const postTranslationSchema = z.object({
	title: z.string(),
	excerpt: z.string(),
	body: z.string()
});

export const postAuthorSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarColor: hexColorSchema
});

export const postSchema = z.object({
	id: z.string(),
	slug: z.string(),
	translations: z.object({
		en: postTranslationSchema,
		de: postTranslationSchema
	}),
	tags: z.array(z.string()),
	author: postAuthorSchema,
	publishedAt: z.iso.datetime(),
	readingTimeMinutes: z.number(),
	coverColor: hexColorSchema
});

export type Post = z.infer<typeof postSchema>;
export type PostTranslation = z.infer<typeof postTranslationSchema>;
export type PostAuthor = z.infer<typeof postAuthorSchema>;
