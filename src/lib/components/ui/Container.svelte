<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<div class="mx-auto w-full max-w-screen-7xl px-page {className}">
	{@render children()}
</div>
