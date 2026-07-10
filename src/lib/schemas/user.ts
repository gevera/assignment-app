import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'editor', 'viewer']);

export const userSchema = z.object({
	id: z.string(),
	email: z.email(),
	password: z.string(),
	name: z.string(),
	role: userRoleSchema
});

/** Authenticated user without password — safe for locals / page data. */
export const sessionUserSchema = userSchema.omit({ password: true });

export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
