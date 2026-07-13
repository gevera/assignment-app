<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$ui';
	import { readDocumentTheme, toggleTheme, type Theme } from '$lib/theme';

	let theme = $state<Theme | null>(null);

	onMount(() => {
		theme = readDocumentTheme();
	});

	function handleToggle() {
		if (theme === null) return;
		theme = toggleTheme(theme);
	}
</script>

<Button
	variant="icon"
	onclick={handleToggle}
	class="cursor-pointer"
	aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	disabled={theme === null}
>
	{#if theme === null}
		<span class="size-5" aria-hidden="true"></span>
	{:else if theme === 'light'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-5"
			aria-hidden="true"
		>
			<path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-5"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		</svg>
	{/if}
</Button>
