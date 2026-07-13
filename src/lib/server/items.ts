import type { Item, ItemStatus } from '$lib/schemas';
import {
	ITEMS_PER_PAGE,
	type ItemsDir,
	type ItemsQuery,
	type ItemsSort
} from '$lib/utils/items-query';
import { getItems } from './data';

export type PagedItems = {
	items: Item[];
	total: number;
	page: number;
	perPage: number;
	pageCount: number;
};

export type ItemUpdate = {
	name?: string;
	budget?: number;
	spent?: number;
	status?: ItemStatus;
};

export function getAllItems(): Item[] {
	return getItems();
}

function compareItems(a: Item, b: Item, sort: ItemsSort, dir: ItemsDir): number {
	const direction = dir === 'asc' ? 1 : -1;
	let av: string | number;
	let bv: string | number;

	if (sort === 'owner') {
		av = a.owner.name;
		bv = b.owner.name;
	} else {
		av = a[sort];
		bv = b[sort];
	}

	if (typeof av === 'string' && typeof bv === 'string') {
		return av.localeCompare(bv) * direction;
	}

	if (av > bv) return direction;
	if (av < bv) return -direction;
	return 0;
}

export function queryItems(input: ItemsQuery): PagedItems {
	const all = getItems();
	let rows = all;

	if (input.q) {
		const q = input.q.toLowerCase();
		rows = rows.filter((row) => row.name.toLowerCase().includes(q));
	}

	if (input.status !== 'all') {
		rows = rows.filter((row) => row.status === input.status);
	}

	if (input.channel !== 'all') {
		rows = rows.filter((row) => row.channel === input.channel);
	}

	rows = [...rows].sort((a, b) => compareItems(a, b, input.sort, input.dir));

	const total = rows.length;
	const pageCount = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
	const page = Math.min(input.page, pageCount);
	const start = (page - 1) * ITEMS_PER_PAGE;
	const items = rows.slice(start, start + ITEMS_PER_PAGE);

	return {
		items,
		total,
		page,
		perPage: ITEMS_PER_PAGE,
		pageCount
	};
}

export function updateItem(id: string, patch: ItemUpdate): Item | null {
	const items = getItems();
	const item = items.find((row) => row.id === id);
	if (!item) return null;

	if (patch.name !== undefined) item.name = patch.name;
	if (patch.budget !== undefined) item.budget = patch.budget;
	if (patch.spent !== undefined) item.spent = patch.spent;
	if (patch.status !== undefined) item.status = patch.status;
	item.updatedAt = new Date().toISOString();
	return item;
}

/** @deprecated Prefer updateItem */
export function updateItemName(id: string, name: string): Item | null {
	return updateItem(id, { name });
}
