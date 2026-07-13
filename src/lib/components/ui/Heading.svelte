<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Level = 1 | 2 | 3;

	type Props = HTMLAttributes<HTMLHeadingElement> & {
		level?: Level;
		class?: string;
		children: Snippet;
	};

	let { level = 1, class: className = '', children, ...rest }: Props = $props();

	const sizes: Record<Level, string> = {
		1: 'text-3xl font-semibold tracking-tight',
		2: 'text-2xl font-semibold tracking-tight',
		3: 'text-xl font-semibold tracking-tight'
	};

	const classes = $derived(`font-display text-fg ${sizes[level]} ${className}`);
</script>

{#if level === 1}
	<h1 {...rest} class={classes}>
		{@render children()}
	</h1>
{:else if level === 2}
	<h2 {...rest} class={classes}>
		{@render children()}
	</h2>
{:else}
	<h3 {...rest} class={classes}>
		{@render children()}
	</h3>
{/if}
