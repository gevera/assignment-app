<script lang="ts">
	import { page } from '$app/state';
	import { DEFAULT_LOCALE, LOCALES, isLocale } from '$lib/i18n';
	import {
		OG_IMAGE,
		OG_LOCALES,
		SITE_NAME,
		SITE_URL,
		alternateLinks,
		canonicalUrl
	} from '$lib/seo';

	type Props = {
		title: string;
		description: string;
		ogType?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
	};

	let { title, description, ogType = 'website', image, noindex = false }: Props = $props();

	const fullTitle = $derived(`${title} — ${SITE_NAME}`);
	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});
	const canonical = $derived(canonicalUrl({ siteUrl: SITE_URL, pathname: page.url.pathname }));
	const alternates = $derived(alternateLinks({ siteUrl: SITE_URL, pathname: page.url.pathname }));
	const ogLocaleAlternates = $derived(
		LOCALES.filter((locale) => locale !== lang).map((locale) => OG_LOCALES[locale])
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<link rel="canonical" href={canonical} />
		{#each alternates as alternate (alternate.hreflang)}
			<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
		{/each}
	{/if}
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={OG_LOCALES[lang]} />
	{#each ogLocaleAlternates as ogLocale (ogLocale)}
		<meta property="og:locale:alternate" content={ogLocale} />
	{/each}
	{#if image}
		<meta property="og:image" content={image} />
		<meta property="og:image:width" content={String(OG_IMAGE.width)} />
		<meta property="og:image:height" content={String(OG_IMAGE.height)} />
	{/if}
	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
</svelte:head>
