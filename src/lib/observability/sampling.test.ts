import { describe, expect, it } from 'vitest';
import { isSessionSampled, parseSampleRate } from './sampling';

function memoryStorage(initial: Record<string, string> = {}) {
	const store = new Map(Object.entries(initial));
	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => void store.set(key, value)
	};
}

describe('parseSampleRate', () => {
	it('parses a valid rate string', () => {
		expect(parseSampleRate('0.25', 1)).toBe(0.25);
		expect(parseSampleRate('0', 1)).toBe(0);
		expect(parseSampleRate('1', 0.1)).toBe(1);
	});

	it('falls back on missing or empty input', () => {
		expect(parseSampleRate(undefined, 0.1)).toBe(0.1);
		expect(parseSampleRate('', 0.1)).toBe(0.1);
	});

	it('falls back on non-numeric or out-of-range input', () => {
		expect(parseSampleRate('abc', 0.1)).toBe(0.1);
		expect(parseSampleRate('-1', 0.1)).toBe(0.1);
		expect(parseSampleRate('2', 0.1)).toBe(0.1);
	});
});

describe('isSessionSampled', () => {
	it('samples when the random draw lands under the rate', () => {
		const storage = memoryStorage();
		expect(isSessionSampled({ rate: 0.1, storage, random: () => 0.09 })).toBe(true);
	});

	it('does not sample when the draw lands on or above the rate', () => {
		const storage = memoryStorage();
		expect(isSessionSampled({ rate: 0.1, storage, random: () => 0.1 })).toBe(false);
	});

	it('persists the decision and never re-rolls within a session', () => {
		const storage = memoryStorage();
		expect(isSessionSampled({ rate: 1, storage, random: () => 0 })).toBe(true);
		// A later draw that would flip the outcome must be ignored.
		expect(isSessionSampled({ rate: 0, storage, random: () => 0.99 })).toBe(true);
	});

	it('honors a previously stored opt-out', () => {
		const storage = memoryStorage({ 'rum:sampled': '0' });
		expect(isSessionSampled({ rate: 1, storage, random: () => 0 })).toBe(false);
	});
});
