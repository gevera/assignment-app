<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import BurgerButton from './BurgerButton.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Button, Container, NavLink } from '$ui';
	import { LOCALES, localizedPath, t } from '$lib/i18n';
	import { openSearchDialog } from '$lib/search/dialog';

	const lang = $derived(page.data.lang ?? page.params.lang ?? 'en');
	const user = $derived(page.data.user);
	const searchOpen = $derived(Boolean(page.state.searchOpen));
	const route = $derived(
		searchOpen
			? (page.state.searchReturnPath ?? '')
			: page.url.pathname.replace(new RegExp(`^/${page.params.lang}`), '') || ''
	);
	const logoutAction = $derived(`${localizedPath({ lang, path: '/login' })}?/logout`);

	type NavItem = { path: string; labelKey: string; match?: 'exact' | 'prefix' };

	const publicLinks = $derived<NavItem[]>([
		{ path: '', labelKey: 'nav.home', match: 'exact' },
		{ path: '/blog', labelKey: 'nav.blog', match: 'prefix' }
	]);

	const authLinks = $derived<NavItem[]>(
		user ? [{ path: '/dashboard', labelKey: 'nav.dashboard', match: 'prefix' }] : []
	);

	const links = $derived([...publicLinks, ...authLinks]);

	let menuOpen = $state(false);
	const menuId = 'main-nav-menu';

	afterNavigate(() => {
		menuOpen = false;
	});

	/** Toggles the mobile navigation menu open or closed. */
	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	/** Closes the mobile navigation menu. */
	function closeMenu() {
		menuOpen = false;
	}

	/** Closes the menu and opens the search dialog. */
	function onSearchClick() {
		closeMenu();
		openSearchDialog();
	}

	/** Closes the mobile menu when Escape is pressed. */
	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) {
			menuOpen = false;
		}
	}

	/** Determines whether a nav link matches the current route. */
	function isActive(item: NavItem): boolean {
		if (item.match === 'exact') {
			return route === item.path || (item.path === '' && route === '');
		}
		return route === item.path || route.startsWith(`${item.path}/`);
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

<nav aria-label="Main">
	<Container class="py-2">
		<div class="flex items-center gap-3">
			<a
				href={localizedPath({ lang, path: '' })}
				class="shrink-0 font-display text-lg font-semibold tracking-tight text-fg"
			>
				Demo
			</a>

			<ul class="hidden min-w-0 flex-1 items-center gap-0.5 md:flex">
				{#each links as item (item.path)}
					<li>
						<NavLink href={localizedPath({ lang, path: item.path })} active={isActive(item)}>
							{$t(`i18n.${item.labelKey}`)}
						</NavLink>
					</li>
				{/each}
				<li>
					<Button
						variant="ghost"
						type="button"
						class="cursor-pointer"
						aria-expanded={searchOpen}
						aria-haspopup="dialog"
						onclick={onSearchClick}
					>
						{$t('i18n.nav.search')}
					</Button>
				</li>
			</ul>

			<div class="ml-auto flex shrink-0 items-center gap-1">
				<div class="mr-4">
					{#if user}
						<form method="POST" action={logoutAction} use:enhance>
							<Button variant="ghost" type="submit" class="w-29 cursor-pointer">
								{$t('i18n.nav.logout')}
							</Button>
						</form>
					{:else}
						<Button href={localizedPath({ lang, path: '/login' })} class="w-29">
							{$t('i18n.nav.login')}
						</Button>
					{/if}
				</div>

				<div
					class="inline-flex h-8 items-center rounded-full border border-border bg-surface p-0.5"
					role="group"
					aria-label="Language"
				>
					{#each LOCALES as locale (locale)}
						{@const active = lang === locale}
						<a
							href={localizedPath({ lang: locale, path: route })}
							data-sveltekit-preload-data="off"
							aria-current={active ? 'true' : undefined}
							class="inline-flex h-7 min-w-8 items-center justify-center rounded-full px-2.5 text-xs tracking-wide uppercase transition-colors {active
								? 'bg-surface-elevated font-semibold text-fg shadow-sm'
								: 'font-medium text-fg-muted hover:text-fg'}"
						>
							{locale}
						</a>
					{/each}
				</div>

				<ThemeToggle />

				<BurgerButton
					open={menuOpen}
					class="md:hidden"
					aria-controls={menuId}
					onclick={toggleMenu}
				/>
			</div>
		</div>

		<div
			id={menuId}
			class="menu-panel -mx-page md:hidden"
			class:menu-panel--open={menuOpen}
			aria-hidden={!menuOpen}
			inert={!menuOpen}
		>
			<div class="menu-panel__inner border-t border-border">
				<ul class="flex justify-evenly py-1">
					{#each links as item (item.path)}
						<li>
							<NavLink
								variant="menu"
								href={localizedPath({ lang, path: item.path })}
								active={isActive(item)}
								onclick={closeMenu}
							>
								{$t(`i18n.${item.labelKey}`)}
							</NavLink>
						</li>
					{/each}
					<li>
						<Button variant="ghost" type="button" class="cursor-pointer" onclick={onSearchClick}>
							{$t('i18n.nav.search')}
						</Button>
					</li>
				</ul>
			</div>
		</div>
	</Container>
</nav>

<style>
	.menu-panel {
		display: grid;
		grid-template-rows: 0fr;
		margin-top: 0;
		opacity: 0;
		transition:
			grid-template-rows 220ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 180ms ease,
			margin-top 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.menu-panel--open {
		grid-template-rows: 1fr;
		opacity: 1;
		margin-top: 0.5rem;
		transition:
			grid-template-rows 260ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 200ms ease 40ms,
			margin-top 260ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.menu-panel__inner {
		overflow: hidden;
		min-height: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-panel,
		.menu-panel--open {
			transition: none;
		}
	}
</style>
