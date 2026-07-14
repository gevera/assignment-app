<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { tick } from 'svelte';
	import { match } from 'ts-pattern';
	import { dialogKeyCommand } from '$lib/utils/matchers';

	type Props = {
		open: boolean;
		title: string;
		onClose: () => void;
		children: Snippet;
		class?: string;
	};

	let { open, title, onClose, children, class: className = '' }: Props = $props();

	const titleId = $props.id();
	let panelEl: HTMLDivElement | undefined = $state();
	let previouslyFocused: HTMLElement | null = null;

	const FOCUSABLE = 'input, button, [href], textarea, select, [tabindex]:not([tabindex="-1"])';

	$effect(() => {
		if (!open) return;

		previouslyFocused =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;

		const { overflow } = document.body.style;
		document.body.style.overflow = 'hidden';

		void tick().then(() => {
			const focusable = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
			focusable?.focus();
		});

		return () => {
			document.body.style.overflow = overflow;
			previouslyFocused?.focus();
		};
	});

	/** Returns all focusable elements within the dialog panel. */
	function focusableElements(): HTMLElement[] {
		if (!panelEl) return [];
		return [...panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
			(el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
		);
	}

	/** Handles Escape to close and traps Tab focus within the dialog. */
	function onKeydown(event: KeyboardEvent) {
		if (!open) return;

		const focusable = focusableElements();
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		match(
			dialogKeyCommand({
				key: event.key,
				shiftKey: event.shiftKey,
				atFirst: focusable.length > 0 && document.activeElement === first,
				atLast: focusable.length > 0 && document.activeElement === last
			})
		)
			.with({ kind: 'close' }, () => {
				event.preventDefault();
				onClose();
			})
			.with({ kind: 'trap', focus: 'first' }, () => {
				event.preventDefault();
				first?.focus();
			})
			.with({ kind: 'trap', focus: 'last' }, () => {
				event.preventDefault();
				last?.focus();
			})
			.with({ kind: 'noop' }, () => undefined)
			.exhaustive();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[15vh]">
		<button
			type="button"
			class="absolute inset-0 bg-surface/75 backdrop-blur-md"
			aria-label="Close"
			onclick={onClose}
			transition:fade={{ duration: 150 }}
		></button>

		<div
			bind:this={panelEl}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			tabindex="-1"
			class="relative z-10 w-full max-w-xl outline-none {className}"
			transition:scale={{ duration: 160, start: 0.97 }}
		>
			<h2 id={titleId} class="sr-only">{title}</h2>
			{@render children()}
		</div>
	</div>
{/if}
