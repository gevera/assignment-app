<script lang="ts">
	import { ItemsEditableCell, StatusMenu, StatusPill } from '$lib/components/dashboard';
	import { t } from '$lib/i18n';
	import type { Item } from '$lib/schemas';
	import { formatCurrency, formatDate, formatPercent } from '$lib/utils/format';

	type Props = {
		item: Item;
		canEdit: boolean;
		numberLocale: string;
		dateLocale: string;
		onEditError?: (message: string) => void;
	};

	let { item, canEdit, numberLocale, dateLocale, onEditError }: Props = $props();

	/** Derives up to two initials from an owner name. */
	function ownerInitials(name: string): string {
		return name
			.split(' ')
			.map((part) => part[0])
			.slice(0, 2)
			.join('');
	}

	const moneyInputClass = 'text-right font-mono tabular-nums';
</script>

<tr class="transition-colors hover:bg-surface">
	<td
		class="min-w-[200px] border-b border-border px-3 py-2.5 font-medium whitespace-normal text-fg"
	>
		{#if canEdit}
			<ItemsEditableCell
				itemId={item.id}
				field="name"
				value={item.name}
				ariaLabel={$t('i18n.dashboard.items.editName')}
				class="font-medium"
				{onEditError}
			/>
		{:else}
			{item.name}
		{/if}
	</td>
	<td class="border-b border-border px-3 py-2.5 whitespace-nowrap">
		{#if canEdit}
			<StatusMenu itemId={item.id} status={item.status} {onEditError} />
		{:else}
			<StatusPill status={item.status} />
		{/if}
	</td>
	<td class="border-b border-border px-3 py-2.5 whitespace-nowrap capitalize">
		{$t(`i18n.dashboard.items.channel.${item.channel}`)}
	</td>
	<td class="border-b border-border px-3 py-2.5 whitespace-nowrap">
		<span class="inline-flex items-center gap-1.5">
			<span
				class="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-fg-muted text-[9px] font-semibold text-surface"
				aria-hidden="true"
			>
				{ownerInitials(item.owner.name)}
			</span>
			{item.owner.name}
		</span>
	</td>
	<td
		class="border-b border-border px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums"
	>
		{#if canEdit}
			<ItemsEditableCell
				itemId={item.id}
				field="budget"
				value={item.budget}
				ariaLabel={$t('i18n.dashboard.items.editBudget')}
				class={moneyInputClass}
				inputmode="decimal"
				{onEditError}
			/>
		{:else}
			{formatCurrency(item.budget, numberLocale)}
		{/if}
	</td>
	<td
		class="border-b border-border px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums"
	>
		{#if canEdit}
			<ItemsEditableCell
				itemId={item.id}
				field="spent"
				value={item.spent}
				ariaLabel={$t('i18n.dashboard.items.editSpent')}
				class={moneyInputClass}
				inputmode="decimal"
				{onEditError}
			/>
		{:else}
			{formatCurrency(item.spent, numberLocale)}
		{/if}
	</td>
	<td
		class="border-b border-border px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums"
	>
		{formatPercent(item.ctr, numberLocale)}
	</td>
	<td class="border-b border-border px-3 py-2.5 whitespace-nowrap">
		{formatDate(item.updatedAt, dateLocale)}
	</td>
</tr>
