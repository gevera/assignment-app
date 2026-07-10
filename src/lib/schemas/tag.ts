import { z } from 'zod';

export const tagSchema = z.object({
	slug: z.string(),
	label: z.object({
		en: z.string(),
		de: z.string()
	})
});

export type Tag = z.infer<typeof tagSchema>;
