import { describe, expect, it } from 'vitest';
import {
	isLocaleOnlyPathChange,
	pathWithoutLocale,
	shouldUseViewTransition
} from './view-transition';

describe('pathWithoutLocale', () => {
	it('strips a supported locale prefix', () => {
		expect(pathWithoutLocale({ pathname: '/en/blog' })).toBe('/blog');
		expect(pathWithoutLocale({ pathname: '/de' })).toBe('/');
	});

	it('returns the pathname when no locale prefix is present', () => {
		expect(pathWithoutLocale({ pathname: '/blog' })).toBe('/blog');
	});
});

describe('isLocaleOnlyPathChange', () => {
	it('detects locale-only path changes', () => {
		expect(isLocaleOnlyPathChange({ from: '/en/blog', to: '/de/blog' })).toBe(true);
		expect(isLocaleOnlyPathChange({ from: '/en', to: '/de' })).toBe(true);
	});

	it('returns false for different routes', () => {
		expect(isLocaleOnlyPathChange({ from: '/en/blog', to: '/en/dashboard' })).toBe(false);
	});
});

describe('shouldUseViewTransition', () => {
	const enabled = { supportsViewTransitions: true, prefersReducedMotion: false };

	it('returns false when view transitions are unavailable or reduced motion is preferred', () => {
		expect(
			shouldUseViewTransition({
				from: '/en',
				to: '/en/blog',
				env: { supportsViewTransitions: false, prefersReducedMotion: false }
			})
		).toBe(false);
		expect(
			shouldUseViewTransition({
				from: '/en',
				to: '/en/blog',
				env: { supportsViewTransitions: true, prefersReducedMotion: true }
			})
		).toBe(false);
	});

	it('returns false for same-path and locale-only navigations', () => {
		expect(shouldUseViewTransition({ from: '/en/blog', to: '/en/blog', env: enabled })).toBe(false);
		expect(shouldUseViewTransition({ from: '/en/blog', to: '/de/blog', env: enabled })).toBe(false);
	});

	it('returns true for route changes', () => {
		expect(shouldUseViewTransition({ from: '/en', to: '/en/blog', env: enabled })).toBe(true);
	});
});
