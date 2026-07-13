<script lang="ts">
	import type { Snippet } from 'svelte';

	type ControlProps = {
		id: string;
		describedby: string | undefined;
		invalid: boolean | undefined;
	};

	type Props = {
		label: string;
		error?: string;
		class?: string;
		children: Snippet<[ControlProps]>;
	};

	let { label, error, class: className = '', children }: Props = $props();

	const id = $props.id();
	const errorId = $derived(error ? `${id}-error` : undefined);
	const invalid = $derived(error ? true : undefined);
</script>

<div class="flex flex-col gap-1.5 {className}">
	<label class="text-sm font-medium text-fg" for={id}>{label}</label>
	{@render children({ id, describedby: errorId, invalid })}
	{#if error}
		<p id={errorId} class="text-sm text-danger" role="alert">{error}</p>
	{/if}
</div>
