<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="mx-auto mb-24 w-full max-w-6xl">
	{@render children()}
</div>
