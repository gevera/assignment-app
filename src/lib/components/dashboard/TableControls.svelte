<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Select } from '$ui';
	import { t } from '$lib/i18n';
	import { itemChannelSchema, itemStatusSchema } from '$lib/schemas';
	import { itemsQueryPath, type ItemsQuery } from '$lib/utils/items-query';

	type Props = {
		query: ItemsQuery;
		filtered?: number | null;
		totalRows?: number | null;
	};

	let { query, filtered = null, totalRows = null }: Props = $props();

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	const statuses = itemStatusSchema.options;
	const channels = itemChannelSchema.options;
	const fail = $derived(page.url.searchParams.get('fail') === '1');
	const lang = $derived(page.params.lang ?? 'en');

	function navigate(next: ItemsQuery) {
		void goto(resolve(itemsQueryPath(lang, next, { fail })), {
			keepFocus: true,
			noScroll: true
		});
	}

	function onSearchInput(event: Event) {
		const value = (event.currentTarget as HTMLInputElement).value;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			navigate({ ...query, q: value, page: 1 });
		}, 200);
	}

	function onStatusChange(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value as ItemsQuery['status'];
		navigate({ ...query, status: value, page: 1 });
	}

	function onChannelChange(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value as ItemsQuery['channel'];
		navigate({ ...query, channel: value, page: 1 });
	}
</script>

<div class="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
	<input
		type="search"
		class="h-11 w-full min-w-0 rounded-md border border-border bg-[color-mix(in_oklab,var(--fg)_6%,var(--surface))] px-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-focus focus:ring-2 focus:ring-focus/20 sm:min-w-[220px] sm:flex-1 md:max-w-xs md:flex-none"
		placeholder={$t('i18n.dashboard.items.searchPlaceholder')}
		value={query.q}
		oninput={onSearchInput}
		aria-label={$t('i18n.dashboard.items.searchPlaceholder')}
	/>

	<div class="grid grid-cols-2 gap-2.5 sm:contents">
		<Select
			class="sm:w-auto sm:min-w-38"
			value={query.status}
			onchange={onStatusChange}
			aria-label={$t('i18n.dashboard.items.column.status')}
		>
			<option value="all">{$t('i18n.dashboard.items.allStatuses')}</option>
			{#each statuses as status (status)}
				<option value={status}>{$t(`i18n.dashboard.items.status.${status}`)}</option>
			{/each}
		</Select>

		<Select
			class="sm:w-auto sm:min-w-38"
			value={query.channel}
			onchange={onChannelChange}
			aria-label={$t('i18n.dashboard.items.column.channel')}
		>
			<option value="all">{$t('i18n.dashboard.items.allChannels')}</option>
			{#each channels as channel (channel)}
				<option value={channel}>{$t(`i18n.dashboard.items.channel.${channel}`)}</option>
			{/each}
		</Select>
	</div>

	{#if filtered !== null && totalRows !== null}
		<div class="font-mono text-xs text-fg-muted sm:ms-auto">
			{$t('i18n.dashboard.items.rowCount', { filtered, total: totalRows })}
		</div>
	{/if}
</div>
