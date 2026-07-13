<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { t } from '$lib/i18n';
	import { actionFailureMessage, isActionSuccess } from '$lib/utils';

	type Props = {
		itemId: string;
		field: 'name' | 'budget' | 'spent';
		value: string | number;
		ariaLabel: string;
		class?: string;
		inputmode?: 'text' | 'decimal';
		onEditError?: (message: string) => void;
	};

	let {
		itemId,
		field,
		value,
		ariaLabel,
		class: className = '',
		inputmode = 'text',
		onEditError
	}: Props = $props();

	let draft = $state<string | null>(null);
	let saving = $state(false);

	const fail = $derived(page.url.searchParams.get('fail') === '1');
	const draftValue = $derived(draft ?? String(value));

	function resetDraft() {
		draft = null;
	}

	function valuesEqual(next: string): boolean {
		if (field === 'name') return next === String(value);
		const parsed = Number(next);
		return Number.isFinite(parsed) && parsed === Number(value);
	}
</script>

<form
	method="POST"
	action="?/updateField"
	use:enhance={() => {
		const previous = String(value);
		saving = true;

		return async ({ result }) => {
			saving = false;

			if (isActionSuccess({ result })) {
				resetDraft();
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
	<input type="hidden" name="field" value={field} />
	{#if fail}
		<input type="hidden" name="_fail" value="1" />
	{/if}
	<input
		class="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-[13px] text-fg outline-none focus:border-focus focus:ring-1 focus:ring-focus/30 disabled:opacity-60 {className}"
		name="value"
		{inputmode}
		aria-label={ariaLabel}
		value={draftValue}
		disabled={saving}
		oninput={(event) => {
			draft = (event.currentTarget as HTMLInputElement).value;
		}}
		onblur={(event) => {
			const form = (event.currentTarget as HTMLInputElement).form;
			const next = draftValue.trim();
			if (!form || next === '' || valuesEqual(next)) {
				resetDraft();
				return;
			}
			form.requestSubmit();
		}}
		onkeydown={(event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				(event.currentTarget as HTMLInputElement).blur();
			}
			if (event.key === 'Escape') {
				resetDraft();
				(event.currentTarget as HTMLInputElement).blur();
			}
		}}
	/>
</form>
