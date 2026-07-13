<script lang="ts">
	type Props = {
		message: string | null;
		onDismiss?: () => void;
	};

	let { message, onDismiss }: Props = $props();
</script>

{#if message}
	<div
		class="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-fg shadow-lg"
		role="status"
		aria-live="polite"
	>
		<div class="flex items-start gap-3">
			<p class="flex-1">{message}</p>
			{#if onDismiss}
				<button
					type="button"
					class="text-fg-muted hover:text-fg"
					aria-label="Dismiss"
					onclick={onDismiss}
				>
					×
				</button>
			{/if}
		</div>
	</div>
{/if}
