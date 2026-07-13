<script lang="ts">
	import type { PostAuthor } from '$lib/schemas';

	type Props = {
		author: PostAuthor;
		size?: 'sm' | 'md';
		class?: string;
	};

	let { author, size = 'sm', class: className = '' }: Props = $props();

	const initials = $derived(
		author.name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
	);

	const sizeClass = $derived(size === 'md' ? 'size-8 text-xs' : 'size-[18px] text-[9px]');
</script>

<span
	class="inline-grid shrink-0 place-items-center rounded-full font-medium text-white {sizeClass} {className}"
	style:background-color={author.avatarColor}
	aria-hidden="true"
	title={author.name}
>
	{initials}
</span>
