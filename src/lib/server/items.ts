import type { Item, ItemStatus } from '$lib/schemas';
import {
	ITEMS_PER_PAGE,
	type ItemsDir,
	type ItemsQuery,
	type ItemsSort
} from '$lib/utils/items-query';
import { compareSortValues, itemSortValues } from '$lib/utils/matchers';
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

/** Return every dashboard item from the in-memory data store. */
export function getAllItems(): Item[] {
	return getItems();
}

/** Compare two items for the active sort column and direction. */
function compareItems(a: Item, b: Item, sort: ItemsSort, dir: ItemsDir): number {
	const direction = dir === 'asc' ? 1 : -1;
	const [av, bv] = itemSortValues({ a, b, sort });
	return compareSortValues({ av, bv, direction });
}

/** Filter, sort, and paginate dashboard items for the items table. */
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

/** Apply a field patch to an item and bump its updatedAt timestamp. */
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

/** @deprecated Prefer updateItem — update only the item name. */
export function updateItemName(id: string, name: string): Item | null {
	return updateItem(id, { name });
}
