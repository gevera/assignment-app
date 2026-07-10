<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { localizedPath, t } from '$lib/i18n';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
	
	const { name, role } = $derived(data.user);
	const lang = $derived(page.params.lang ?? 'en');
	const logoutAction = $derived(`${localizedPath({ lang, path: '/login' })}?/logout`);
</script>

<header>
	<p>{name} ({role})</p>
	<nav aria-label="Dashboard">
		<a href={localizedPath({ lang, path: '/dashboard' })}>{$t('i18n.dashboard.title')}</a>
		<a href={localizedPath({ lang, path: '/dashboard/items' })}>{$t('i18n.dashboard.items.title')}</a>
	</nav>
	<form method="POST" action={logoutAction} use:enhance>
		<button type="submit">{$t('i18n.nav.logout')}</button>
	</form>
</header>

{@render children()}
