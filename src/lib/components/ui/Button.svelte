<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'ghost' | 'icon';

	type BaseProps = { variant?: Variant; class?: string; children: Snippet };
	type AnchorProps = BaseProps & HTMLAnchorAttributes & { href: string };
	type NativeButtonProps = BaseProps & HTMLButtonAttributes & { href?: never };
	type Props = AnchorProps | NativeButtonProps;

	let { variant = 'primary', class: className = '', children, ...rest }: Props = $props();

	const base =
		'inline-flex items-center justify-center text-sm whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50';

	const variants: Record<Variant, string> = {
		primary: 'h-11 rounded-md bg-accent px-4 font-medium text-accent-fg',
		ghost: 'h-11 px-2 text-fg-muted hover:text-fg',
		icon: 'h-11 w-11 shrink-0 rounded-md text-fg-muted hover:text-fg'
	};
</script>

{#if rest.href !== undefined}
	<a {...rest} class="{base} {variants[variant]} {className}">
		{@render children()}
	</a>
{:else}
	<button type="button" {...rest} class="{base} {variants[variant]} {className}">
		{@render children()}
	</button>
{/if}
