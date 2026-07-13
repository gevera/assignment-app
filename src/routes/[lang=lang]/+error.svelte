<script lang="ts">
	import { page } from '$app/state';
	import { defaultLocale, localizedPath, t, addTranslations, setLocale } from '$lib/i18n';
	import { SITE_NAME } from '$lib/seo';
	import { Button, Heading } from '$ui';

	const lang = $derived(page.error?.lang ?? page.data.lang ?? page.params.lang ?? defaultLocale);

	$effect(() => {
		if (page.error?.translations) {
			addTranslations(page.error.translations);
		}
		void setLocale(lang);
	});
</script>

<svelte:head>
	<title>{page.status} — {$t('i18n.common.error')} — {SITE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-0 w-full flex-1 flex-col">
	<div class="min-h-0 flex-1" aria-hidden="true"></div>
	<div class="mx-auto w-full max-w-sm shrink-0">
		<Heading class="text-center text-6xl">{page.status}</Heading>
		<p class="mt-2 text-center text-sm text-fg-muted">{$t('i18n.common.error')}</p>
		<Button href={localizedPath({ lang, path: '' })} class="mt-8 w-full">
			{$t('i18n.nav.home')}
		</Button>
	</div>
	<div class="min-h-0 flex-2" aria-hidden="true"></div>
</div>
