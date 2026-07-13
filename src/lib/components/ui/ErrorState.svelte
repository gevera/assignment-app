<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { t } from '$lib/i18n';

	type Props = {
		message?: string;
		class?: string;
	};

	let { message, class: className = '' }: Props = $props();

	async function retry() {
		await invalidateAll();
	}
</script>

<div
	class="flex flex-col items-start gap-3 rounded-lg border border-border bg-surface-elevated px-5 py-8 {className}"
	role="alert"
>
	<p class="text-base font-medium text-fg">{message ?? $t('i18n.common.error')}</p>
	<button
		type="button"
		class="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg hover:border-fg-muted"
		onclick={retry}
	>
		{$t('i18n.common.retry')}
	</button>
</div>
