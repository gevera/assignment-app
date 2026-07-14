import { SignJWT, jwtVerify } from 'jose';
import { AUTH_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import type { SessionUser } from '$lib/schemas';

export type { SessionUser };

export const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Encode AUTH_SECRET for jose signing and verification. */
function getSecretKey() {
	if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
		throw new Error('AUTH_SECRET must be set and at least 32 characters');
	}
	return new TextEncoder().encode(AUTH_SECRET);
}

/** Sign a JWT session token for the given user. */
export async function createSessionToken({ email, name, role, id }: SessionUser): Promise<string> {
	return new SignJWT({
		email,
		name,
		role
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(id)
		.setIssuedAt()
		.setExpirationTime(`${SESSION_MAX_AGE}s`)
		.sign(getSecretKey());
}

/** Verify a session JWT and return the user payload, or null if invalid. */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
	try {
		const { payload } = await jwtVerify(token, getSecretKey(), {
			algorithms: ['HS256']
		});

		const { sub, email, name, role } = payload;

		if (
			typeof sub !== 'string' ||
			typeof email !== 'string' ||
			typeof name !== 'string' ||
			(role !== 'admin' && role !== 'editor' && role !== 'viewer')
		) {
			return null;
		}

		return { id: sub, email, name, role };
	} catch {
		return null;
	}
}

/** Persist the session JWT as an httpOnly cookie. */
export function setSessionCookie({ cookies, token }: { cookies: Cookies; token: string }) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: SESSION_MAX_AGE
	});
}

/** Remove the session cookie from the response. */
export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev
	});
}

/** Read and verify the current session user from cookies. */
export async function readSessionUser(cookies: Cookies): Promise<SessionUser | null> {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return null;
	return verifySessionToken(token);
}
