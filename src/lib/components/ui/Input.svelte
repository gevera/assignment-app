<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		class?: string;
	};

	let { class: className = '', ...rest }: Props = $props();

	const invalid = $derived(rest['aria-invalid'] === true || rest['aria-invalid'] === 'true');
</script>

<input
	{...rest}
	class="h-11 w-full rounded-md border px-3 text-sm text-fg transition-colors placeholder:text-fg-muted disabled:opacity-50 {invalid
		? 'border-danger'
		: 'border-border'} bg-[color-mix(in_oklab,var(--fg)_6%,var(--surface))] {className}"
/>
