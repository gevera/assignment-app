import type { ItemsSort } from '$lib/utils/items-query';

export type ItemsColumn = {
	key: ItemsSort;
	labelKey: string;
	numeric?: boolean;
};

export const ITEMS_COLUMNS: ItemsColumn[] = [
	{ key: 'name', labelKey: 'i18n.dashboard.items.column.name' },
	{ key: 'status', labelKey: 'i18n.dashboard.items.column.status' },
	{ key: 'channel', labelKey: 'i18n.dashboard.items.column.channel' },
	{ key: 'owner', labelKey: 'i18n.dashboard.items.column.owner' },
	{ key: 'budget', labelKey: 'i18n.dashboard.items.column.budget', numeric: true },
	{ key: 'spent', labelKey: 'i18n.dashboard.items.column.spent', numeric: true },
	{ key: 'ctr', labelKey: 'i18n.dashboard.items.column.ctr', numeric: true },
	{ key: 'updatedAt', labelKey: 'i18n.dashboard.items.column.updated' }
];
