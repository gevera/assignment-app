import { describe, expect, it } from 'vitest';
import type { Item } from '$lib/schemas';
import {
	actionFailureMessage,
	classifyLocaleSegment,
	compareSortValues,
	fieldToPatch,
	isActionSuccess,
	itemSortValues,
	menuKeyCommand,
	menuTriggerCommand,
	nextSortDirection,
	resolveLocaleRouting
} from './matchers';

const baseItem = {
	id: '1',
	name: 'Alpha',
	status: 'active' as const,
	channel: 'email' as const,
	owner: { id: 'u1', name: 'Zed' },
	budget: 100,
	spent: 40,
	impressions: 0,
	clicks: 0,
	ctr: 0.1,
	startDate: '2024-01-01',
	endDate: '2024-12-31',
	updatedAt: '2024-06-01T00:00:00.000Z',
	tags: []
} satisfies Item;

describe('fieldToPatch', () => {
	it('maps name field', () => {
		expect(fieldToPatch({ field: 'name', value: 'Campaign' })).toEqual({ name: 'Campaign' });
	});

	it('maps budget and spent fields', () => {
		expect(fieldToPatch({ field: 'budget', value: 50 })).toEqual({ budget: 50 });
		expect(fieldToPatch({ field: 'spent', value: 12 })).toEqual({ spent: 12 });
	});

	it('maps status field', () => {
		expect(fieldToPatch({ field: 'status', value: 'paused' })).toEqual({ status: 'paused' });
	});
});

describe('nextSortDirection', () => {
	it('flips direction on the same column', () => {
		expect(nextSortDirection({ sort: 'name', dir: 'asc', key: 'name' })).toBe('desc');
		expect(nextSortDirection({ sort: 'name', dir: 'desc', key: 'name' })).toBe('asc');
	});

	it('defaults numeric-ish columns to desc', () => {
		expect(nextSortDirection({ sort: 'name', dir: 'asc', key: 'budget' })).toBe('desc');
		expect(nextSortDirection({ sort: 'name', dir: 'asc', key: 'updatedAt' })).toBe('desc');
		expect(nextSortDirection({ sort: 'name', dir: 'asc', key: 'spent' })).toBe('desc');
		expect(nextSortDirection({ sort: 'name', dir: 'asc', key: 'ctr' })).toBe('desc');
	});

	it('defaults other columns to asc', () => {
		expect(nextSortDirection({ sort: 'budget', dir: 'desc', key: 'name' })).toBe('asc');
		expect(nextSortDirection({ sort: 'budget', dir: 'desc', key: 'owner' })).toBe('asc');
	});
});

describe('itemSortValues / compareSortValues', () => {
	const a = { ...baseItem, name: 'Alpha', owner: { id: '1', name: 'Ann' }, budget: 10 };
	const b = { ...baseItem, id: '2', name: 'Beta', owner: { id: '2', name: 'Bob' }, budget: 20 };

	it('reads owner names when sorting by owner', () => {
		expect(itemSortValues({ a, b, sort: 'owner' })).toEqual(['Ann', 'Bob']);
	});

	it('reads direct item fields otherwise', () => {
		expect(itemSortValues({ a, b, sort: 'name' })).toEqual(['Alpha', 'Beta']);
		expect(itemSortValues({ a, b, sort: 'budget' })).toEqual([10, 20]);
	});

	it('compares strings with localeCompare', () => {
		expect(compareSortValues({ av: 'a', bv: 'b', direction: 1 })).toBeLessThan(0);
		expect(compareSortValues({ av: 'a', bv: 'b', direction: -1 })).toBeGreaterThan(0);
	});

	it('compares numbers by magnitude', () => {
		expect(compareSortValues({ av: 1, bv: 2, direction: 1 })).toBe(-1);
		expect(compareSortValues({ av: 2, bv: 1, direction: 1 })).toBe(1);
		expect(compareSortValues({ av: 2, bv: 2, direction: 1 })).toBe(0);
	});
});

describe('actionFailureMessage / isActionSuccess', () => {
	it('detects success results', () => {
		expect(isActionSuccess({ result: { type: 'success', status: 200 } })).toBe(true);
		expect(
			isActionSuccess({ result: { type: 'failure', status: 400, data: undefined } })
		).toBe(false);
	});

	it('reads failure message when present', () => {
		expect(
			actionFailureMessage({
				result: {
					type: 'failure',
					status: 403,
					data: { message: 'dashboard.items.editForbidden' }
				}
			})
		).toBe('dashboard.items.editForbidden');
	});

	it('falls back when message is missing', () => {
		expect(
			actionFailureMessage({
				result: { type: 'failure', status: 500, data: undefined },
				fallback: 'fallback.key'
			})
		).toBe('fallback.key');
		expect(
			actionFailureMessage({
				result: { type: 'error', status: 500, error: new Error('x') }
			})
		).toBe('dashboard.items.editFailed');
	});
});

describe('menuTriggerCommand / menuKeyCommand', () => {
	it('maps trigger keys to open commands', () => {
		expect(menuTriggerCommand({ key: 'ArrowDown', lastIndex: 4 })).toEqual({
			kind: 'open',
			index: 0
		});
		expect(menuTriggerCommand({ key: 'Enter', lastIndex: 4 })).toEqual({
			kind: 'open',
			index: 0
		});
		expect(menuTriggerCommand({ key: ' ', lastIndex: 4 })).toEqual({
			kind: 'open',
			index: 0
		});
		expect(menuTriggerCommand({ key: 'ArrowUp', lastIndex: 4 })).toEqual({
			kind: 'open',
			index: 4
		});
		expect(menuTriggerCommand({ key: 'Tab', lastIndex: 4 })).toEqual({ kind: 'noop' });
	});

	it('maps menu keys to focus/close commands', () => {
		expect(menuKeyCommand({ key: 'Escape', activeIndex: 2, length: 5 })).toEqual({
			kind: 'close',
			restoreFocus: true,
			preventDefault: true
		});
		expect(menuKeyCommand({ key: 'ArrowDown', activeIndex: 2, length: 5 })).toEqual({
			kind: 'focus',
			index: 3
		});
		expect(menuKeyCommand({ key: 'ArrowUp', activeIndex: 0, length: 5 })).toEqual({
			kind: 'focus',
			index: 4
		});
		expect(menuKeyCommand({ key: 'Home', activeIndex: 2, length: 5 })).toEqual({
			kind: 'focus',
			index: 0
		});
		expect(menuKeyCommand({ key: 'End', activeIndex: 2, length: 5 })).toEqual({
			kind: 'focus',
			index: 4
		});
		expect(menuKeyCommand({ key: 'Tab', activeIndex: 2, length: 5 })).toEqual({
			kind: 'close',
			restoreFocus: false,
			preventDefault: false
		});
		expect(menuKeyCommand({ key: 'a', activeIndex: 2, length: 5 })).toEqual({ kind: 'noop' });
	});
});

describe('classifyLocaleSegment / resolveLocaleRouting', () => {
	const supported = ['en', 'de'];

	it('classifies supported, unsupported-locale, and missing segments', () => {
		expect(classifyLocaleSegment({ segment: 'en', supported })).toEqual({
			kind: 'supported',
			segment: 'en'
		});
		expect(classifyLocaleSegment({ segment: 'fr', supported })).toEqual({
			kind: 'unsupported-locale'
		});
		expect(classifyLocaleSegment({ segment: 'dashboard', supported })).toEqual({
			kind: 'missing'
		});
		expect(classifyLocaleSegment({ segment: undefined, supported })).toEqual({
			kind: 'missing'
		});
	});

	it('resolves routing without redirect for known locale shapes', () => {
		expect(
			resolveLocaleRouting({ kind: { kind: 'supported', segment: 'de' }, preferred: 'en' })
		).toEqual({
			lang: 'de',
			shouldRedirect: false
		});
		expect(
			resolveLocaleRouting({ kind: { kind: 'unsupported-locale' }, preferred: 'en' })
		).toEqual({
			lang: 'en',
			shouldRedirect: false
		});
	});

	it('redirects when the first segment is not a locale', () => {
		expect(resolveLocaleRouting({ kind: { kind: 'missing' }, preferred: 'de' })).toEqual({
			lang: 'de',
			shouldRedirect: true
		});
	});
});
