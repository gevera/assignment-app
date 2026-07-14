<script lang="ts">
	import type { Component } from 'svelte';
	import { page } from '$app/state';
	import { closeSearchDialog, openSearchDialog } from '$lib/search/dialog';

	let SearchDialog = $state<Component | null>(null);
	let loadPromise: Promise<void> | null = null;

	const isOpen = $derived(Boolean(page.state.searchOpen));

	/** Dynamically imports SearchDialog when it is not yet loaded. */
	async function ensureLoaded() {
		if (SearchDialog) return;
		if (!loadPromise) {
			loadPromise = import('./SearchDialog.svelte').then((mod) => {
				SearchDialog = mod.default;
			});
		}
		await loadPromise;
	}

	$effect(() => {
		if (isOpen) void ensureLoaded();
	});

	/** Toggles the search dialog on Ctrl/Cmd+K. */
	function onWindowKeydown(event: KeyboardEvent) {
		if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return;
		event.preventDefault();
		if (page.state.searchOpen) {
			closeSearchDialog();
			return;
		}
		void ensureLoaded();
		openSearchDialog();
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if SearchDialog}
	<SearchDialog />
{/if}
