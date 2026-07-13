<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Variant = 'bar' | 'menu';

	type Props = HTMLAnchorAttributes & {
		href: string;
		active?: boolean;
		variant?: Variant;
		children: Snippet;
	};

	let {
		href,
		active = false,
		variant = 'bar',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, { base: string; active: string; inactive: string }> = {
		bar: {
			base: 'inline-flex h-11 shrink-0 items-center justify-center px-3 text-sm whitespace-nowrap transition-colors',
			active: 'text-fg underline decoration-fg underline-offset-8',
			inactive: 'text-fg-muted hover:text-fg'
		},
		menu: {
			base: 'flex min-h-11 items-center px-page text-base transition-colors',
			active: 'font-medium text-fg',
			inactive: 'text-fg-muted hover:text-fg'
		}
	};
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- primitive receives an already-resolved href (e.g. via localizedPath) from its caller -->
<a
	{...rest}
	{href}
	aria-current={active ? 'page' : undefined}
	class="{variants[variant].base} {active
		? variants[variant].active
		: variants[variant].inactive} {className}"
>
	{@render children()}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
