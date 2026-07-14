const SESSION_KEY = 'rum:session-id';

/** Stable per-tab session id so beacons from one visit correlate. */
export function getSessionId(): string {
	const existing = sessionStorage.getItem(SESSION_KEY);
	if (existing) return existing;

	const id = crypto.randomUUID();
	sessionStorage.setItem(SESSION_KEY, id);
	return id;
}
