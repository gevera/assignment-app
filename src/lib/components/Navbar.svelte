<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { localizedPath, t } from '$lib/i18n';

	const lang = $derived(page.data.lang);
	const route = $derived(page.data.route);

	function switchLocale(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		goto(resolve(`/${target.value}${route ?? ''}${page.url.search}`));
	}
</script>

<nav aria-label="Main">
	<ul>
		<li><a href={localizedPath(lang, '')}>{$t('i18n.nav.home')}</a></li>
		<li><a href={localizedPath(lang, '/blog')}>{$t('i18n.nav.blog')}</a></li>
		<li><a href={localizedPath(lang, '/search')}>{$t('i18n.nav.search')}</a></li>
		<li><a href={localizedPath(lang, '/login')}>{$t('i18n.nav.login')}</a></li>
		<li><a href={localizedPath(lang, '/dashboard/items')}>{$t('i18n.nav.dashboard')}</a></li>
	</ul>
	<select value={lang} onchange={switchLocale} aria-label="Language">
		<option value="en">{$t('lang.en')}</option>
		<option value="de">{$t('lang.de')}</option>
	</select>
</nav>
