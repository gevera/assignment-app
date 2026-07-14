<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import LazySearchDialog from '$lib/components/blog/LazySearchDialog.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import SkipLink from '$lib/components/SkipLink.svelte';
	import { shouldUseViewTransition, viewTransitionNavigation } from '$lib/utils/view-transition';
	import { Container } from '$ui';
	import './layout.css';

	let { children } = $props();

	onNavigate((navigation) => {
		const from = navigation.from?.url.pathname;
		const to = navigation.to?.url.pathname;

		if (
			!shouldUseViewTransition({
				from,
				to,
				env: {
					supportsViewTransitions: Boolean(document.startViewTransition),
					prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
				}
			})
		) {
			return;
		}

		return viewTransitionNavigation({
			navigation,
			startViewTransition: document.startViewTransition.bind(document)
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<SkipLink />
	<header
		class="sticky top-0 z-40 border-b border-border bg-surface/75 backdrop-blur-md [view-transition-name:site-header]"
	>
		<Navbar />
	</header>
	<main id="main-content" tabindex="-1" class="flex flex-1 flex-col outline-none">
		<Container class="flex flex-1 flex-col overflow-x-scroll py-section">
			{@render children()}
		</Container>
	</main>
	<footer
		class="border-t border-border py-2 text-center text-sm text-fg-muted [view-transition-name:site-footer]"
	>
		<Container>
			<p>© 2026 Demo Co.</p>
		</Container>
	</footer>
</div>

<LazySearchDialog />
