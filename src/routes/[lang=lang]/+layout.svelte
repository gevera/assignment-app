<script lang="ts">
	import { browser } from '$app/environment';
	import { ErrorState } from '$ui';

	let { children } = $props();

	/**
	 * Report client render/effect crashes to the RUM beacon.
	 * SSR errors bypass the boundary and take the handleError → +error.svelte path.
	 */
	async function report(error: unknown) {
		if (!browser) return;
		const { captureException } = await import('$lib/observability');
		captureException(error, 'boundary');
	}
</script>

<svelte:boundary onerror={(error) => void report(error)}>
	{@render children()}

	{#snippet failed(_error, reset)}
		<div class="mx-auto w-full max-w-md py-16">
			<ErrorState onretry={reset} />
		</div>
	{/snippet}
</svelte:boundary>
