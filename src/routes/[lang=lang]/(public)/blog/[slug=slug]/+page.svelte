<script lang="ts">
	import { page } from '$app/state';
	import Meta from '$lib/components/Meta.svelte';
	import { DEFAULT_LOCALE, isLocale, t } from '$lib/i18n';
	import { SITE_URL, articleJsonLd, breadcrumbJsonLd, canonicalUrl, jsonLdScript } from '$lib/seo';

	let { data } = $props();

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});
	const translation = $derived(data.post.translations[lang]);
	const postUrl = $derived(canonicalUrl({ siteUrl: SITE_URL, pathname: page.url.pathname }));

	const structuredData = $derived(
		jsonLdScript(
			articleJsonLd({
				url: postUrl,
				headline: translation.title,
				description: translation.excerpt,
				datePublished: data.post.publishedAt,
				authorName: data.post.author.name
			})
		) +
			jsonLdScript(
				breadcrumbJsonLd([
					{
						name: $t('i18n.nav.home'),
						url: canonicalUrl({ siteUrl: SITE_URL, pathname: `/${lang}` })
					},
					{
						name: $t('i18n.nav.blog'),
						url: canonicalUrl({ siteUrl: SITE_URL, pathname: `/${lang}/blog` })
					},
					{ name: translation.title, url: postUrl }
				])
			)
	);
</script>

<Meta
	title={translation.title}
	description={translation.excerpt}
	ogType="article"
	image="{postUrl}/og.png"
/>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- <-escaped JSON built in $lib/seo -->
	{@html structuredData}
</svelte:head>

<h1>Blog Post</h1>
<pre>{JSON.stringify(data.post, null, 2)}</pre>
