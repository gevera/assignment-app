import { z } from 'zod';

export const webVitalMetricSchema = z.object({
	name: z.enum(['LCP', 'INP', 'CLS', 'TTFB']),
	id: z.string(),
	value: z.number(),
	delta: z.number().optional(),
	rating: z.enum(['good', 'needs-improvement', 'poor']),
	navigationType: z.string().optional()
});

export const errorSourceSchema = z.enum([
	'window-error',
	'unhandledrejection',
	'client-hooks',
	'boundary'
]);

const beaconBaseSchema = z.object({
	sessionId: z.string(),
	page: z.string(),
	ts: z.number()
});

export const beaconPayloadSchema = z.discriminatedUnion('type', [
	beaconBaseSchema.extend({
		type: z.literal('web-vitals'),
		metrics: z.array(webVitalMetricSchema).min(1)
	}),
	beaconBaseSchema.extend({
		type: z.literal('error'),
		message: z.string(),
		stack: z.string().optional(),
		source: errorSourceSchema
	})
]);

export type WebVitalMetric = z.infer<typeof webVitalMetricSchema>;
export type ErrorSource = z.infer<typeof errorSourceSchema>;
export type BeaconPayload = z.infer<typeof beaconPayloadSchema>;
