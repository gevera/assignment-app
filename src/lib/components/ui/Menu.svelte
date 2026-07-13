<script lang="ts">
	import type { Snippet } from 'svelte';

	export type MenuOption = {
		value: string;
		label: string;
	};

	type TriggerArgs = {
		open: boolean;
		props: {
			id: string;
			type: 'button';
			'aria-haspopup': 'menu';
			'aria-expanded': boolean;
			'aria-controls': string;
			disabled: boolean | undefined;
			onclick: (event: MouseEvent) => void;
			onkeydown: (event: KeyboardEvent) => void;
		};
	};

	type Props = {
		options: MenuOption[];
		ariaLabel: string;
		disabled?: boolean;
		onSelect: (value: string) => void;
		trigger: Snippet<[TriggerArgs]>;
		class?: string;
	};

	let {
		options,
		ariaLabel,
		disabled = false,
		onSelect,
		trigger,
		class: className = ''
	}: Props = $props();

	const uid = $props.id();
	const menuId = `${uid}-menu`;
	const triggerId = `${uid}-trigger`;

	let open = $state(false);
	let activeIndex = $state(0);
	let rootEl: HTMLDivElement | undefined = $state();
	let menuEl: HTMLUListElement | undefined = $state();

	function attachRoot(node: HTMLDivElement) {
		rootEl = node;
		return () => {
			rootEl = undefined;
		};
	}

	function attachMenu(node: HTMLUListElement) {
		menuEl = node;
		return () => {
			menuEl = undefined;
		};
	}

	function getItemButtons(): HTMLButtonElement[] {
		if (!menuEl) return [];
		return [...menuEl.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
	}

	function focusItem(index: number) {
		getItemButtons()[index]?.focus();
	}

	function openMenu(index = 0) {
		if (disabled || options.length === 0) return;
		activeIndex = Math.max(0, Math.min(index, options.length - 1));
		open = true;
		queueMicrotask(() => focusItem(activeIndex));
	}

	function closeMenu(restoreFocus = true) {
		if (!open) return;
		open = false;
		if (restoreFocus) {
			queueMicrotask(() => document.getElementById(triggerId)?.focus());
		}
	}

	function selectOption(value: string) {
		closeMenu(true);
		onSelect(value);
	}

	function onTriggerClick(event: MouseEvent) {
		event.preventDefault();
		if (open) {
			closeMenu(false);
			return;
		}
		openMenu(0);
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openMenu(0);
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			openMenu(options.length - 1);
		}
	}

	function onMenuKeydown(event: KeyboardEvent) {
		if (!open) return;

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				closeMenu(true);
				break;
			case 'ArrowDown':
				event.preventDefault();
				activeIndex = (activeIndex + 1) % options.length;
				focusItem(activeIndex);
				break;
			case 'ArrowUp':
				event.preventDefault();
				activeIndex = (activeIndex - 1 + options.length) % options.length;
				focusItem(activeIndex);
				break;
			case 'Home':
				event.preventDefault();
				activeIndex = 0;
				focusItem(activeIndex);
				break;
			case 'End':
				event.preventDefault();
				activeIndex = options.length - 1;
				focusItem(activeIndex);
				break;
			case 'Tab':
				closeMenu(false);
				break;
		}
	}

	function onDocumentPointerDown(event: PointerEvent) {
		if (!open || !rootEl) return;
		const target = event.target as Node | null;
		if (target && !rootEl.contains(target)) {
			closeMenu(false);
		}
	}

	const triggerProps = $derived({
		id: triggerId,
		type: 'button' as const,
		'aria-haspopup': 'menu' as const,
		'aria-expanded': open,
		'aria-controls': menuId,
		disabled: disabled || undefined,
		onclick: onTriggerClick,
		onkeydown: onTriggerKeydown
	});
</script>

<svelte:document onpointerdown={onDocumentPointerDown} />

<div class="relative inline-flex {className}" {@attach attachRoot}>
	{@render trigger({ open, props: triggerProps })}

	{#if open}
		<ul
			id={menuId}
			class="absolute top-full left-0 z-50 mt-1 min-w-[10rem] rounded-md border border-border bg-surface-elevated py-1 shadow-md"
			role="menu"
			aria-label={ariaLabel}
			onkeydown={onMenuKeydown}
			{@attach attachMenu}
		>
			{#each options as option, index (option.value)}
				<li role="none">
					<button
						type="button"
						class="flex w-full items-center px-3 py-1.5 text-left text-sm text-fg hover:bg-surface focus:bg-surface focus:outline-none"
						role="menuitem"
						tabindex={index === activeIndex ? 0 : -1}
						onclick={() => selectOption(option.value)}
						onmouseenter={() => {
							activeIndex = index;
						}}
					>
						{option.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
