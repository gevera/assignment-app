<script lang="ts">
	import { page } from '$app/state';
	import ItemsTable from '$lib/components/dashboard/ItemsTable.svelte';
	import Pager from '$lib/components/dashboard/Pager.svelte';
	import TableControls from '$lib/components/dashboard/TableControls.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { t } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let toastMessage = $state<string | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	const lang = $derived(page.params.lang ?? 'en');
	const result = $derived(data.result);

	/** Displays a toast message and auto-dismisses it after four seconds. */
	function showToast(message: string) {
		toastMessage = message;
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toastMessage = null;
		}, 4000);
	}
</script>

<svelte:head>
	<title>{$t('i18n.dashboard.items.title')}</title>
	<meta name="description" content={$t('i18n.dashboard.items.meta.description')} />
</svelte:head>

<div class="py-section">
	<h1
		class="mb-6 text-3xl font-semibold text-fg"
		style="font-family: system-ui, -apple-system, sans-serif"
	>
		{$t('i18n.dashboard.items.title')}
	</h1>

	<TableControls query={data.query} filtered={result.total} totalRows={data.catalogTotal} />

	{#if result.total === 0}
		<EmptyState title={$t('i18n.dashboard.items.empty')} />
	{:else}
		<div
			class="overflow-hidden rounded-xl border border-border bg-surface-elevated"
			style="content-visibility: auto; contain-intrinsic-size: 640px"
		>
			<ItemsTable
				items={result.items}
				query={data.query}
				canEdit={data.canEdit}
				locale={lang}
				onEditError={showToast}
			/>
			<Pager
				query={data.query}
				total={result.total}
				pageCount={result.pageCount}
				currentPage={result.page}
				perPage={result.perPage}
			/>
		</div>
	{/if}
</div>

<Toast message={toastMessage} onDismiss={() => (toastMessage = null)} />
