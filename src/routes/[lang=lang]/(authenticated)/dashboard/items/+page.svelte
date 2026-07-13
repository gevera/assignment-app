<script lang="ts">
	import { page } from '$app/state';
	import ItemsTable from '$lib/components/dashboard/ItemsTable.svelte';
	import Pager from '$lib/components/dashboard/Pager.svelte';
	import TableControls from '$lib/components/dashboard/TableControls.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { t } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let toastMessage = $state<string | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	const lang = $derived(page.params.lang ?? 'en');

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
	<h1 class="mb-6 font-display text-3xl font-semibold text-fg">
		{$t('i18n.dashboard.items.title')}
	</h1>

	{#await data.result}
		<TableControls query={data.query} />
		<div class="overflow-hidden rounded-xl border border-border bg-surface-elevated p-3">
			<Skeleton rows={10} />
			<p class="sr-only">{$t('i18n.common.loading')}</p>
		</div>
	{:then result}
		<TableControls query={data.query} filtered={result.total} totalRows={data.catalogTotal} />

		{#if result.total === 0}
			<EmptyState title={$t('i18n.dashboard.items.empty')} />
		{:else}
			<div class="overflow-hidden rounded-xl border border-border bg-surface-elevated">
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
	{:catch}
		<TableControls query={data.query} />
		<ErrorState />
	{/await}
</div>

<Toast message={toastMessage} onDismiss={() => (toastMessage = null)} />
