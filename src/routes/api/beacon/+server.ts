import type { RequestHandler } from './$types';
import { beaconPayloadSchema } from '$lib/schemas';

/**
 * RUM + error beacon. Accepts navigator.sendBeacon blobs and fetch-keepalive
 * JSON alike by reading the raw body, so content-type never matters.
 */
export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = JSON.parse(await request.text());
	} catch {
		return new Response(null, { status: 400 });
	}

	const parsed = beaconPayloadSchema.safeParse(body);
	if (!parsed.success) {
		return new Response(null, { status: 400 });
	}

	// Sentry stub: swap this sink for Sentry.captureMessage/captureException
	// (or any RUM vendor ingest) without touching the client wiring.
	console.log(JSON.stringify({ beacon: parsed.data }));

	return new Response(null, { status: 204 });
};
