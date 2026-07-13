<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'default' | 'featured';

	type Props = HTMLAttributes<HTMLDivElement> & {
		variant?: Variant;
		class?: string;
		children: Snippet;
	};

	let { variant = 'default', class: className = '', children, ...rest }: Props = $props();

	const base = 'rounded-lg bg-surface-elevated p-6';

	const variants: Record<Variant, string> = {
		default: 'border border-border',
		featured: 'border-2 border-accent'
	};
</script>

<div {...rest} class="{base} {variants[variant]} {className}">
	{@render children()}
</div>
