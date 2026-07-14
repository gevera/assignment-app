import type { ClientInit, HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

/**
 * Runs once on client start: always-on error reporting, sampled RUM.
 * The observability module is imported dynamically so web-vitals stays out
 * of the initial entry chunk (the bundle budget traces static imports) and
 * off the critical rendering path.
 */
export const init: ClientInit = async () => {
	const { initWebVitals, captureException, isSessionSampled, parseSampleRate } =
		await import('$lib/observability');

	// Errors are never sampled — every one ships to the beacon.
	addEventListener('error', (event) => {
		captureException(event.error ?? event.message, 'window-error');
	});
	addEventListener('unhandledrejection', (event) => {
		captureException(event.reason, 'unhandledrejection');
	});

	const rate = parseSampleRate(env.PUBLIC_RUM_SAMPLE_RATE, dev ? 1 : 0.1);
	if (isSessionSampled({ rate, storage: sessionStorage })) {
		initWebVitals();
	}
};

/** Report unexpected client-side errors to the beacon, then render the message. */
export const handleError: HandleClientError = async ({ error, message }) => {
	const { captureException } = await import('$lib/observability');
	captureException(error, 'client-hooks');

	// lang/translations are already hydrated on the client; message suffices.
	return { message };
};
