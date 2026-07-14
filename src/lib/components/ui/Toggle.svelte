<script lang="ts">
	type Props = {
		checked?: boolean;
		label: string;
		disabled?: boolean;
		onchange?: (checked: boolean) => void;
		class?: string;
	};

	let {
		checked = $bindable(false),
		label,
		disabled = false,
		onchange,
		class: className = ''
	}: Props = $props();

	const switchId = $props.id();

	/** Flips the switch checked state and fires the change callback. */
	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<div class="inline-flex items-center gap-2 text-sm text-fg-muted {className}">
	<button
		id={switchId}
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label}
		{disabled}
		onclick={toggle}
		class="relative h-5 w-9 shrink-0 cursor-pointer rounded-full border border-border transition-colors disabled:cursor-not-allowed disabled:opacity-50 {checked
			? 'bg-accent'
			: 'bg-[color-mix(in_oklab,var(--fg)_12%,var(--surface))]'}"
	>
		<span
			class="absolute top-0.5 left-0.5 size-3.5 rounded-full bg-surface-elevated shadow-sm transition-transform {checked
				? 'translate-x-4'
				: 'translate-x-0'}"
			aria-hidden="true"
		></span>
	</button>
	<span aria-hidden="true">{label}</span>
</div>
