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

<style>
	.status-pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		text-transform: capitalize;
	}

	.status-pill::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: currentColor;
	}

	.st-draft {
		background: #f1f5f9;
		color: #475569;
	}
	.st-scheduled {
		background: #fef3c7;
		color: #92400e;
	}
	.st-active {
		background: #dcfce7;
		color: #166534;
	}
	.st-paused {
		background: #fee2e2;
		color: #991b1b;
	}
	.st-completed {
		background: #dbeafe;
		color: #1e40af;
	}
	.st-archived {
		background: #e2e8f0;
		color: #334155;
	}

	:global([data-theme='dark']) .st-draft {
		background: #1f2937;
		color: #94a3b8;
	}
	:global([data-theme='dark']) .st-scheduled {
		background: #422006;
		color: #fcd34d;
	}
	:global([data-theme='dark']) .st-active {
		background: #052e16;
		color: #86efac;
	}
	:global([data-theme='dark']) .st-paused {
		background: #450a0a;
		color: #fca5a5;
	}
	:global([data-theme='dark']) .st-completed {
		background: #0c1e3d;
		color: #93c5fd;
	}
	:global([data-theme='dark']) .st-archived {
		background: #1e293b;
		color: #94a3b8;
	}
</style>
