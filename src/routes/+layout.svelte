<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Navbar, SearchDialog, SkipLink } from '$lib/components';
	import { Container } from '$ui';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<SkipLink />
	<header class="sticky top-0 z-40 border-b border-border bg-surface/75 backdrop-blur-md">
		<Navbar />
	</header>
	<main id="main-content" tabindex="-1" class="flex flex-1 flex-col outline-none">
		<Container class="flex flex-1 flex-col overflow-x-scroll py-section">
			{@render children()}
		</Container>
	</main>
	<footer class="border-t border-border py-2 text-center text-sm text-fg-muted">
		<Container>
			<p>© 2026 Demo Co.</p>
		</Container>
	</footer>
</div>

<SearchDialog />
