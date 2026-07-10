<script lang="ts">
	import { page } from '$app/state';
	import { defaultLocale, localizedPath, t, addTranslations, setLocale } from '$lib/i18n';

	const lang = $derived(page.error?.lang ?? page.data.lang ?? page.params.lang ?? defaultLocale);

	$effect(() => {
		if (page.error?.translations) {
			addTranslations(page.error.translations);
		}
		void setLocale(lang);
	});
</script>

<h1>{page.status}</h1>
<p>{$t('i18n.common.error')}</p>
<a href={localizedPath({ lang, path: '' })}>{$t('i18n.nav.home')}</a>
