<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { t } from '$lib/i18n';
	import { itemsQueryPath, type ItemsQuery } from '$lib/utils/items-query';

	type Props = {
		query: ItemsQuery;
		total: number;
		pageCount: number;
		currentPage: number;
		perPage: number;
	};

	let { query, total, pageCount, currentPage, perPage }: Props = $props();

	const fail = $derived(page.url.searchParams.get('fail') === '1');
	const lang = $derived(page.params.lang ?? 'en');

	const start = $derived(total === 0 ? 0 : (currentPage - 1) * perPage + 1);
	const end = $derived(Math.min(currentPage * perPage, total));

	const windowPages = $derived.by(() => {
		const windowSize = 5;
		let from = Math.max(1, currentPage - 2);
		let to = Math.min(pageCount, from + windowSize - 1);
		from = Math.max(1, to - windowSize + 1);
		const pages: number[] = [];
		for (let i = from; i <= to; i++) pages.push(i);
		return pages;
	});

	function goToPage(target: number) {
		if (target < 1 || target > pageCount || target === currentPage) return;
		void goto(resolve(itemsQueryPath(lang, { ...query, page: target }, { fail })), {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div
	class="flex flex-col-reverse sm:flex-row items-center justify-center gap-2 sm:justify-between border-t border-border bg-surface px-3.5 py-2.5 text-[12.5px] text-fg-muted flex-wrap"
>
	<div>
		{$t('i18n.dashboard.items.showing', { start, end, total })}
	</div>
	<div class="flex gap-1">
		<button
			type="button"
			class="rounded-md border border-border bg-surface-elevated px-2.5 py-1 font-mono text-xs font-semibold text-fg disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-focus hover:enabled:text-focus"
			disabled={currentPage === 1}
			aria-label={$t('i18n.dashboard.items.prevPage')}
			onclick={() => goToPage(currentPage - 1)}
		>
			‹
		</button>
		{#each windowPages as p (p)}
			<button
				type="button"
				class="rounded-md border px-2.5 py-1 font-mono text-xs font-semibold {p === currentPage
					? 'border-accent bg-accent text-accent-fg'
					: 'border-border bg-surface-elevated text-fg hover:border-focus hover:text-focus'}"
				aria-current={p === currentPage ? 'page' : undefined}
				onclick={() => goToPage(p)}
			>
				{p}
			</button>
		{/each}
		<button
			type="button"
			class="rounded-md border border-border bg-surface-elevated px-2.5 py-1 font-mono text-xs font-semibold text-fg disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-focus hover:enabled:text-focus"
			disabled={currentPage === pageCount}
			aria-label={$t('i18n.dashboard.items.nextPage')}
			onclick={() => goToPage(currentPage + 1)}
		>
			›
		</button>
	</div>
</div>
