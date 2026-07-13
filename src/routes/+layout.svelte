<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import SkipLink from '$lib/components/SkipLink.svelte';
	import Container from '$lib/components/ui/Container.svelte';
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
	<main id="main-content" tabindex="-1" class="flex-1 outline-none">
		<Container class="py-section overflow-x-scroll">
			{@render children()}
		</Container>
	</main>
	<footer class="border-t border-border py-2 text-center text-sm text-fg-muted">
		<Container>
			<p>© 2026 Demo Co.</p>
		</Container>
	</footer>
</div>
