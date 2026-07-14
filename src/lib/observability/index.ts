import type { ErrorSource } from '$lib/schemas';
import { sendToBeacon } from './beacon-client';
import { getSessionId } from './session';

export { parseSampleRate, isSessionSampled } from './sampling';
export { initWebVitals } from './vitals';

/**
 * Sentry-stub: report an exception to the beacon endpoint.
 * Errors are never sampled — every one ships.
 */
export function captureException(error: unknown, source: ErrorSource): void {
	const normalized = error instanceof Error ? error : new Error(String(error));

	sendToBeacon({
		type: 'error',
		sessionId: getSessionId(),
		page: location.pathname,
		ts: Date.now(),
		message: normalized.message,
		stack: normalized.stack,
		source
	});
}
