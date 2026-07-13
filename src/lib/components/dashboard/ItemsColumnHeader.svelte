<script lang="ts">
	import { t } from '$lib/i18n';
	import type { ItemsDir, ItemsSort } from '$lib/utils/items-query';
	import type { ItemsColumn } from './columns';

	type Props = {
		column: ItemsColumn;
		activeSort: ItemsSort;
		dir: ItemsDir;
		onsort: (key: ItemsSort) => void;
	};

	let { column, activeSort, dir, onsort }: Props = $props();

	const active = $derived(activeSort === column.key);
	const ariaSort = $derived(
		!active ? 'none' : dir === 'asc' ? 'ascending' : 'descending'
	);

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onsort(column.key);
		}
	}
</script>

<th
	scope="col"
	role="columnheader"
	tabindex="0"
	aria-sort={ariaSort}
	class="sticky top-0 cursor-pointer select-none border-b border-border bg-surface px-3 py-2.5 align-middle text-[11px] font-semibold tracking-wide text-fg-muted uppercase hover:text-fg {column.numeric
		? 'text-right'
		: 'text-left'}"
	onclick={() => onsort(column.key)}
	onkeydown={onKeydown}
>
	<span
		class="inline-flex items-center gap-1 whitespace-nowrap {column.numeric ? 'justify-end' : ''}"
	>
		{$t(column.labelKey)}
		<span
			class="inline-flex h-3 w-3 shrink-0 items-center justify-center text-accent {active
				? 'opacity-100'
				: 'opacity-0'}"
			aria-hidden="true"
		>
			{dir === 'asc' ? '▴' : '▾'}
		</span>
	</span>
</th>
