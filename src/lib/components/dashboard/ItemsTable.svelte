<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ItemsColumnHeader, ItemsTableRow } from '$lib/components/dashboard'
	import { ITEMS_COLUMNS } from '$lib/components/dashboard/columns';
	import type { Item } from '$lib/schemas';
	import {
		itemsQueryPath,
		nextSortDirection,
		type ItemsQuery,
		type ItemsSort
	} from '$lib/utils';

	type Props = {
		items: Item[];
		query: ItemsQuery;
		canEdit: boolean;
		locale: string;
		onEditError?: (message: string) => void;
	};

	let { items, query, canEdit, locale, onEditError }: Props = $props();

	const fail = $derived(page.url.searchParams.get('fail') === '1');
	const numberLocale = $derived(locale === 'de' ? 'de-DE' : 'en-US');
	const dateLocale = $derived(locale === 'de' ? 'de-DE' : 'en-GB');
	const lang = $derived(page.params.lang ?? 'en');

	function toggleSort(key: ItemsSort) {
		const dir = nextSortDirection({ sort: query.sort, dir: query.dir, key });
		const next: ItemsQuery = { ...query, sort: key, dir, page: 1 };
		void goto(resolve(itemsQueryPath(lang, next, { fail })), {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full border-collapse text-[13px]">
		<thead>
			<tr>
				{#each ITEMS_COLUMNS as column (column.key)}
					<ItemsColumnHeader
						{column}
						activeSort={query.sort}
						dir={query.dir}
						onsort={toggleSort}
					/>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.id)}
				<ItemsTableRow
					{item}
					{canEdit}
					{numberLocale}
					{dateLocale}
					{onEditError}
				/>
			{/each}
		</tbody>
	</table>
</div>
