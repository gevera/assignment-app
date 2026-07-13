<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'neutral' | 'accent';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: Variant;
		class?: string;
		children: Snippet;
	};

	let { variant = 'neutral', class: className = '', children, ...rest }: Props = $props();

	const base =
		'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap';

	const variants: Record<Variant, string> = {
		neutral: 'border border-border bg-surface text-fg-muted',
		accent: 'bg-accent text-accent-fg'
	};
</script>

<span {...rest} class="{base} {variants[variant]} {className}">
	{@render children()}
</span>
