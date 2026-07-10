import { describe, expect, it } from 'vitest';
import { createSessionToken, verifySessionToken } from './session';
import { authenticateUser, safeRedirectPath } from './auth';
import type { SessionUser } from '$lib/schemas';

const demoUser: SessionUser = {
	id: 'demo_admin',
	email: 'admin@demo.test',
	name: 'Demo Admin',
	role: 'admin'
};

describe('session tokens', () => {
	it('round-trips a session user', async () => {
		const token = await createSessionToken(demoUser);
		const user = await verifySessionToken(token);
		expect(user).toEqual(demoUser);
	});

	it('rejects a tampered token', async () => {
		const token = await createSessionToken(demoUser);
		const tampered = token.slice(0, -4) + 'xxxx';
		expect(await verifySessionToken(tampered)).toBeNull();
	});

	it('rejects garbage', async () => {
		expect(await verifySessionToken('not-a-jwt')).toBeNull();
	});
});

describe('authenticateUser', () => {
	it('returns session user for valid demo credentials', () => {
		expect(authenticateUser({ email: 'admin@demo.test', password: 'demo1234' })).toEqual(demoUser);
	});

	it('returns null for bad password', () => {
		expect(authenticateUser({ email: 'admin@demo.test', password: 'wrong' })).toBeNull();
	});
});

describe('safeRedirectPath', () => {
	it('allows same-locale relative paths', () => {
		expect(safeRedirectPath({ redirectTo: '/en/dashboard/items', lang: 'en' })).toBe(
			'/en/dashboard/items'
		);
	});

	it('rejects open redirects', () => {
		expect(safeRedirectPath({ redirectTo: 'https://evil.test', lang: 'en' })).toBe('/en/dashboard');
		expect(safeRedirectPath({ redirectTo: '//evil.test', lang: 'en' })).toBe('/en/dashboard');
		expect(safeRedirectPath({ redirectTo: '/de/dashboard', lang: 'en' })).toBe('/en/dashboard');
	});
});
