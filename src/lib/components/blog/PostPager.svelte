<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DEFAULT_LOCALE, isLocale, t } from '$lib/i18n';
	import { blogQueryPath, parseBlogQuery } from '$lib/utils/posts-query';

	type Props = {
		total: number;
		pageCount: number;
		currentPage: number;
		perPage: number;
	};

	let { total, pageCount, currentPage, perPage }: Props = $props();

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});
	const query = $derived(parseBlogQuery(page.url));
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

	/** Navigates to the selected blog results page. */
	function goToPage(target: number) {
		if (target < 1 || target > pageCount || target === currentPage) return;
		void goto(resolve(blogQueryPath({ lang, query: { ...query, page: target } })), {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div
	class="flex flex-col-reverse flex-wrap items-center justify-center gap-2 border-t border-border bg-surface px-3.5 py-2.5 text-[12.5px] text-fg-muted sm:flex-row sm:justify-between"
>
	<div>
		{$t('i18n.dashboard.items.showing', { start, end, total })}
	</div>
	<div class="flex gap-1">
		<button
			type="button"
			class="rounded-md border border-border px-2.5 py-1 hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-40"
			disabled={currentPage <= 1}
			onclick={() => goToPage(currentPage - 1)}
			aria-label={$t('i18n.dashboard.items.prevPage')}
		>
			←
		</button>
		{#each windowPages as pageNum (pageNum)}
			<button
				type="button"
				class="min-w-8 rounded-md border px-2.5 py-1 {pageNum === currentPage
					? 'border-accent bg-accent text-accent-fg'
					: 'border-border hover:bg-surface-elevated'}"
				aria-current={pageNum === currentPage ? 'page' : undefined}
				onclick={() => goToPage(pageNum)}
			>
				{pageNum}
			</button>
		{/each}
		<button
			type="button"
			class="rounded-md border border-border px-2.5 py-1 hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-40"
			disabled={currentPage >= pageCount}
			onclick={() => goToPage(currentPage + 1)}
			aria-label={$t('i18n.dashboard.items.nextPage')}
		>
			→
		</button>
	</div>
</div>
