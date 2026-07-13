<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		open?: boolean;
	};

	let { open = false, class: className = '', ...rest }: Props = $props();
</script>

<button
	type="button"
	{...rest}
	class="burger inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg {className}"
	class:burger--open={open}
	aria-expanded={open}
	aria-label={open ? 'Close menu' : 'Open menu'}
>
	<span class="burger-icon" aria-hidden="true">
		<span class="burger-line"></span>
		<span class="burger-line"></span>
		<span class="burger-line"></span>
	</span>
</button>

<style>
	.burger-icon {
		position: relative;
		display: block;
		width: 1.125rem;
		height: 0.875rem;
	}

	.burger-line {
		position: absolute;
		left: 0;
		display: block;
		width: 100%;
		height: 1.75px;
		border-radius: 999px;
		background: currentColor;
		transition:
			transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 160ms ease,
			top 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.burger-line:nth-child(1) {
		top: 0;
	}

	.burger-line:nth-child(2) {
		top: 50%;
		transform: translateY(-50%);
	}

	.burger-line:nth-child(3) {
		top: 100%;
		transform: translateY(-100%);
	}

	.burger--open .burger-line:nth-child(1) {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
	}

	.burger--open .burger-line:nth-child(2) {
		opacity: 0;
		transform: translateY(-50%) scaleX(0.4);
	}

	.burger--open .burger-line:nth-child(3) {
		top: 50%;
		transform: translateY(-50%) rotate(-45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.burger-line {
			transition: none;
		}
	}
</style>
