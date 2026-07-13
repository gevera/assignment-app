<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import BurgerButton from './BurgerButton.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Button, Container, NavLink } from '$ui';
	import { LOCALES, localizedPath, t, type Locale } from '$lib/i18n';
	import en from '../../../mocks/i18n.en.json';
	import de from '../../../mocks/i18n.de.json';

	const catalogs = { en, de } satisfies Record<Locale, typeof en>;
	type CatalogKey = keyof typeof en;

	const lang = $derived(page.data.lang ?? page.params.lang ?? 'en');
	const user = $derived(page.data.user);
	const route = $derived(page.url.pathname.replace(new RegExp(`^/${page.params.lang}`), '') || '');
	const logoutAction = $derived(`${localizedPath({ lang, path: '/login' })}?/logout`);

	type NavItem = { path: string; labelKey: CatalogKey; match?: 'exact' | 'prefix' };

	const publicLinks = $derived<NavItem[]>([
		{ path: '', labelKey: 'nav.home', match: 'exact' },
		{ path: '/blog', labelKey: 'nav.blog', match: 'prefix' },
		{ path: '/search', labelKey: 'nav.search', match: 'exact' }
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

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && menuOpen) {
			menuOpen = false;
		}
	}

	function isActive(item: NavItem): boolean {
		if (item.match === 'exact') {
			return route === item.path || (item.path === '' && route === '');
		}
		return route === item.path || route.startsWith(`${item.path}/`);
	}
</script>

{#snippet stableLabel(key: CatalogKey)}
	<span class="inline-grid justify-items-center">
		{#each LOCALES as locale (locale)}
			<span class="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
				{catalogs[locale][key]}
			</span>
		{/each}
		<span class="col-start-1 row-start-1 whitespace-nowrap">{$t(`i18n.${key}`)}</span>
	</span>
{/snippet}

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
							{@render stableLabel(item.labelKey)}
						</NavLink>
					</li>
				{/each}
			</ul>

			<div class="ml-auto flex shrink-0 items-center gap-1">
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

				{#if user}
					<form method="POST" action={logoutAction} use:enhance class="hidden sm:block">
						<Button variant="ghost" type="submit" class="cursor-pointer">
							{@render stableLabel('nav.logout')}
						</Button>
					</form>
				{:else}
					<div class="hidden sm:block">
						<Button
						href={localizedPath({ lang, path: '/login' })}>
							{@render stableLabel('nav.login')}
						</Button>
					</div>
				{/if}

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
				</ul>

				<div class="flex justify-center border-t border-border px-page py-3 sm:hidden">
					{#if user}
						<form method="POST" action={logoutAction} use:enhance>
							<Button variant="ghost" type="submit">
								{$t('i18n.nav.logout')}
							</Button>
						</form>
					{:else}
						<Button href={localizedPath({ lang, path: '/login' })} onclick={closeMenu}>
							{$t('i18n.nav.login')}
						</Button>
					{/if}
				</div>
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
