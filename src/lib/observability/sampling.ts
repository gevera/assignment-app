const SAMPLED_KEY = 'rum:sampled';

type SessionStorageLike = Pick<Storage, 'getItem' | 'setItem'>;

/** Parse a sample-rate string into [0, 1]; anything else falls back. */
export function parseSampleRate(raw: string | undefined, fallback: number): number {
	if (raw === undefined || raw === '') return fallback;
	const rate = Number(raw);
	return Number.isFinite(rate) && rate >= 0 && rate <= 1 ? rate : fallback;
}

/**
 * Decide once per session whether RUM is collected, then stick to it —
 * a session is either fully sampled or fully silent, never a mix.
 */
export function isSessionSampled({
	rate,
	storage,
	random = Math.random
}: {
	rate: number;
	storage: SessionStorageLike;
	random?: () => number;
}): boolean {
	const existing = storage.getItem(SAMPLED_KEY);
	if (existing !== null) return existing === '1';

	const sampled = random() < rate;
	storage.setItem(SAMPLED_KEY, sampled ? '1' : '0');
	return sampled;
}
