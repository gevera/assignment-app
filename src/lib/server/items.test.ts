import { describe, expect, it } from 'vitest';
import { getAllItems, queryItems, updateItem } from './items';

describe('queryItems', () => {
	const base = {
		q: '',
		status: 'all' as const,
		channel: 'all' as const,
		sort: 'updatedAt' as const,
		dir: 'desc' as const,
		page: 1
	};

	it('returns first page of 10 by default', () => {
		const result = queryItems(base);
		expect(result.perPage).toBe(10);
		expect(result.items).toHaveLength(10);
		expect(result.total).toBe(getAllItems().length);
		expect(result.page).toBe(1);
	});

	it('filters by name query case-insensitively', () => {
		const sample = getAllItems()[0];
		const fragment = sample.name.slice(0, 4).toLowerCase();
		const result = queryItems({ ...base, q: fragment });
		expect(result.total).toBeGreaterThan(0);
		expect(result.items.every((item) => item.name.toLowerCase().includes(fragment))).toBe(true);
	});

	it('filters by status and channel', () => {
		const result = queryItems({ ...base, status: 'active', channel: 'email' });
		expect(result.items.every((item) => item.status === 'active' && item.channel === 'email')).toBe(
			true
		);
	});

	it('sorts by owner name ascending', () => {
		const result = queryItems({ ...base, sort: 'owner', dir: 'asc', page: 1 });
		const names = result.items.map((item) => item.owner.name);
		const sorted = [...names].sort((a, b) => a.localeCompare(b));
		expect(names).toEqual(sorted);
	});

	it('sorts by budget descending', () => {
		const result = queryItems({ ...base, sort: 'budget', dir: 'desc' });
		for (let i = 1; i < result.items.length; i++) {
			expect(result.items[i - 1].budget).toBeGreaterThanOrEqual(result.items[i].budget);
		}
	});

	it('clamps page when beyond pageCount', () => {
		const result = queryItems({ ...base, page: 9999 });
		expect(result.page).toBe(result.pageCount);
		expect(result.items.length).toBeGreaterThan(0);
	});

	it('returns empty items when filters match nothing', () => {
		const result = queryItems({ ...base, q: 'zzz-no-such-campaign-zzz' });
		expect(result.total).toBe(0);
		expect(result.items).toHaveLength(0);
		expect(result.pageCount).toBe(1);
		expect(result.page).toBe(1);
	});
});

describe('updateItem', () => {
	it('updates name and bumps updatedAt', () => {
		const item = getAllItems()[0];
		const originalName = item.name;
		const previous = item.updatedAt;
		const updated = updateItem(item.id, { name: `${originalName} (edited)` });
		expect(updated).not.toBeNull();
		expect(updated!.name).toBe(`${originalName} (edited)`);
		expect(updated!.updatedAt).not.toBe(previous);

		updateItem(item.id, { name: originalName });
	});

	it('updates budget and spent and bumps updatedAt', () => {
		const item = getAllItems()[1];
		const originalBudget = item.budget;
		const originalSpent = item.spent;
		const previous = item.updatedAt;

		const updated = updateItem(item.id, {
			budget: originalBudget + 100,
			spent: originalSpent + 10
		});
		expect(updated).not.toBeNull();
		expect(updated!.budget).toBe(originalBudget + 100);
		expect(updated!.spent).toBe(originalSpent + 10);
		expect(updated!.updatedAt).not.toBe(previous);

		updateItem(item.id, { budget: originalBudget, spent: originalSpent });
	});

	it('updates status and bumps updatedAt', () => {
		const item = getAllItems()[2];
		const originalStatus = item.status;
		const nextStatus = originalStatus === 'active' ? 'paused' : 'active';
		const previous = item.updatedAt;

		const updated = updateItem(item.id, { status: nextStatus });
		expect(updated).not.toBeNull();
		expect(updated!.status).toBe(nextStatus);
		expect(updated!.updatedAt).not.toBe(previous);

		updateItem(item.id, { status: originalStatus });
	});

	it('returns null for unknown id', () => {
		expect(updateItem('missing-id', { name: 'Nope' })).toBeNull();
	});
});
