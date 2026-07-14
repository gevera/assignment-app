import { expect, test } from '@playwright/test';

test.describe('RUM beacon endpoint', () => {
	test('accepts a web-vitals payload', async ({ request }) => {
		const response = await request.post('/api/beacon', {
			data: {
				type: 'web-vitals',
				sessionId: 'e2e-session',
				page: '/en',
				ts: Date.now(),
				metrics: [{ name: 'LCP', id: 'v1-e2e', value: 1234, rating: 'good' }]
			}
		});
		expect(response.status()).toBe(204);
	});

	test('accepts an error report', async ({ request }) => {
		const response = await request.post('/api/beacon', {
			data: {
				type: 'error',
				sessionId: 'e2e-session',
				page: '/en',
				ts: Date.now(),
				message: 'e2e synthetic error',
				source: 'window-error'
			}
		});
		expect(response.status()).toBe(204);
	});

	test('rejects a payload that fails schema validation', async ({ request }) => {
		const response = await request.post('/api/beacon', {
			data: { type: 'web-vitals', metrics: [] }
		});
		expect(response.status()).toBe(400);
	});

	test('rejects a non-JSON body', async ({ request }) => {
		// Sent as application/json so it passes SvelteKit's CSRF content-type
		// filter (which would 403 text/plain) and hits the handler's parse guard.
		const response = await request.post('/api/beacon', {
			headers: { 'content-type': 'application/json' },
			data: 'not json'
		});
		expect(response.status()).toBe(400);
	});
});
