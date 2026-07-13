<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description?: string;
		children?: Snippet;
		class?: string;
	};

	let { title, description, children, class: className = '' }: Props = $props();
</script>

<div
	class="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface-elevated px-5 py-8 {className}"
	role="status"
>
	<p class="text-base font-medium text-fg">{title}</p>
	{#if description}
		<p class="text-sm text-fg-muted">{description}</p>
	{/if}
	{#if children}
		<div class="mt-2">
			{@render children()}
		</div>
	{/if}
</div>
