<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Props = HTMLSelectAttributes & {
		class?: string;
		children: Snippet;
	};

	let { class: className = '', children, ...rest }: Props = $props();

	const invalid = $derived(rest['aria-invalid'] === true || rest['aria-invalid'] === 'true');
</script>

<select
	{...rest}
	class="h-11 min-w-0 w-full rounded-md border py-0 pe-10 ps-3 text-sm text-fg transition-colors disabled:opacity-50 {invalid
		? 'border-danger'
		: 'border-border'} bg-[color-mix(in_oklab,var(--fg)_6%,var(--surface))] {className}"
>
	{@render children()}
</select>
