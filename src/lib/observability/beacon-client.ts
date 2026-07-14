import type { BeaconPayload } from '$lib/schemas';

const ENDPOINT = '/api/beacon';

/**
 * Ship a payload to the beacon endpoint. sendBeacon survives page unload;
 * fetch keepalive is the fallback. A JSON blob (not a bare string, which
 * would go out as text/plain) keeps the request off SvelteKit's CSRF
 * form-content-type checks.
 */
export function sendToBeacon(payload: BeaconPayload): void {
	const body = JSON.stringify(payload);

	if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'application/json' }))) {
		return;
	}

	fetch(ENDPOINT, {
		method: 'POST',
		body,
		keepalive: true,
		headers: { 'content-type': 'application/json' }
	}).catch(() => {
		// Telemetry must never surface errors to the user.
	});
}
