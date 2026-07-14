<script lang="ts">
	import type { ItemStatus } from '$lib/schemas';
	import { t } from '$lib/i18n';

	type Props = {
		status: ItemStatus;
	};

	let { status }: Props = $props();
</script>

<span class="status-pill st-{status}">
	{$t(`i18n.dashboard.items.status.${status}`)}
</span>
