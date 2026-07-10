import { z } from 'zod';

export const itemStatusSchema = z.enum([
	'draft',
	'scheduled',
	'active',
	'paused',
	'completed',
	'archived'
]);

export const itemChannelSchema = z.enum(['email', 'sms', 'web', 'social', 'push']);

export const itemOwnerSchema = z.object({
	id: z.string(),
	name: z.string()
});

export const itemSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: itemStatusSchema,
	channel: itemChannelSchema,
	owner: itemOwnerSchema,
	budget: z.number(),
	spent: z.number(),
	impressions: z.number(),
	clicks: z.number(),
	ctr: z.number().min(0).max(1),
	startDate: z.iso.date(),
	endDate: z.iso.date(),
	updatedAt: z.iso.datetime(),
	tags: z.array(z.string())
});

export type Item = z.infer<typeof itemSchema>;
export type ItemStatus = z.infer<typeof itemStatusSchema>;
export type ItemChannel = z.infer<typeof itemChannelSchema>;
export type ItemOwner = z.infer<typeof itemOwnerSchema>;
