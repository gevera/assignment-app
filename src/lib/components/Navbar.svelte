<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { localizedPath, t } from '$lib/i18n';

	const lang = $derived(page.data.lang);
	const user = $derived(page.data.user);
	const route = $derived(page.url.pathname.replace(new RegExp(`^/${page.params.lang}`), ''));
	const logoutAction = $derived(`${localizedPath({ lang, path: '/login' })}?/logout`);

	function switchLocale(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		goto(resolve(`/${target.value}${route ?? ''}${page.url.search}`));
	}
</script>

<nav aria-label="Main">
	<ul>
		<li><a href={localizedPath({ lang, path: '' })}>{$t('i18n.nav.home')}</a></li>
		<li><a href={localizedPath({ lang, path: '/blog' })}>{$t('i18n.nav.blog')}</a></li>
		<li><a href={localizedPath({ lang, path: '/search' })}>{$t('i18n.nav.search')}</a></li>
		{#if user}
			<li><a href={localizedPath({ lang, path: '/dashboard' })}>{$t('i18n.nav.dashboard')}</a></li>
			<li>
				<form method="POST" action={logoutAction} use:enhance>
					<button type="submit">{$t('i18n.nav.logout')}</button>
				</form>
			</li>
		{:else}
			<li><a href={localizedPath({ lang, path: '/login' })}>{$t('i18n.nav.login')}</a></li>
		{/if}
	</ul>
	<select value={lang} onchange={switchLocale} aria-label="Language">
		<option value="en">{$t('lang.en')}</option>
		<option value="de">{$t('lang.de')}</option>
	</select>
</nav>
