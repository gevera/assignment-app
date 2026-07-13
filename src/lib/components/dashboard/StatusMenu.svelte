<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { StatusPill } from '$lib/components/dashboard';
	import { Menu } from '$ui';
	import { t } from '$lib/i18n';
	import { itemStatusSchema, type ItemStatus } from '$lib/schemas';
	import { actionFailureMessage, isActionSuccess } from '$lib/utils';

	type Props = {
		itemId: string;
		status: ItemStatus;
		onEditError?: (message: string) => void;
	};

	let { itemId, status, onEditError }: Props = $props();

	let draft = $state<ItemStatus | null>(null);
	let saving = $state(false);
	let formEl: HTMLFormElement | undefined = $state();

	function attachForm(node: HTMLFormElement) {
		formEl = node;
		return () => {
			formEl = undefined;
		};
	}

	const fail = $derived(page.url.searchParams.get('fail') === '1');
	const displayStatus = $derived(draft ?? status);
	const options = $derived(
		itemStatusSchema.options.map((value) => ({
			value,
			label: $t(`i18n.dashboard.items.status.${value}`)
		}))
	);

	function handleSelect(value: string) {
		if (saving || value === (draft ?? status)) return;
		draft = value as ItemStatus;
		queueMicrotask(() => formEl?.requestSubmit());
	}
</script>

<form
	{@attach attachForm}
	method="POST"
	action="?/updateField"
	use:enhance={() => {
		const previous = status;
		saving = true;

		return async ({ result }) => {
			saving = false;

			if (isActionSuccess({ result })) {
				draft = null;
				await invalidate('app:items');
				await applyAction(result);
				return;
			}

			draft = previous;
			onEditError?.($t(`i18n.${actionFailureMessage({ result })}`));
			await applyAction(result);
		};
	}}
>
	<input type="hidden" name="id" value={itemId} />
	<input type="hidden" name="field" value="status" />
	<input type="hidden" name="value" value={displayStatus} />
	{#if fail}
		<input type="hidden" name="_fail" value="1" />
	{/if}

	<Menu
		{options}
		ariaLabel={$t('i18n.dashboard.items.editStatus')}
		disabled={saving}
		onSelect={handleSelect}
	>
		{#snippet trigger({ props })}
			<button
				{...props}
				class="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/40 disabled:opacity-60"
				aria-label={$t('i18n.dashboard.items.editStatus')}
			>
				<StatusPill status={displayStatus} />
			</button>
		{/snippet}
	</Menu>
</form>
