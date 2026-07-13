<script lang="ts">
	type Props = {
		class?: string;
		rows?: number;
	};

	let { class: className = '', rows = 10 }: Props = $props();
</script>

<div class="animate-pulse space-y-2 {className}" aria-hidden="true">
	{#each Array.from({ length: rows }, (_, i) => i) as i (i)}
		<div class="h-9 rounded-md bg-border/60"></div>
	{/each}
</div>
