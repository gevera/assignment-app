<script lang="ts">
	import { contrastingInk } from '$lib/utils/contrast';

	type Props = {
		name: string;
		color: string;
		size?: 'sm' | 'md';
		class?: string;
	};

	let { name, color, size = 'sm', class: className = '' }: Props = $props();

	const initials = $derived(
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
	);

	const sizeClass = $derived(size === 'md' ? 'size-8 text-xs' : 'size-[18px] text-[9px]');
	const ink = $derived(contrastingInk(color));
</script>

<span
	class="inline-grid shrink-0 place-items-center rounded-full font-medium {sizeClass} {className}"
	style:background-color={color}
	style:color={ink}
	aria-hidden="true"
	title={name}
>
	{initials}
</span>
