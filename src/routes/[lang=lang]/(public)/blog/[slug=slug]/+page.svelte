<script lang="ts">
	import { page } from '$app/state';
	import Meta from '$lib/components/Meta.svelte';
	import { AuthorAvatar, TagBadge } from '$lib/components/blog';
	import { Heading } from '$ui';
	import { DEFAULT_LOCALE, isLocale, t } from '$lib/i18n';
	import { SITE_URL, articleJsonLd, breadcrumbJsonLd, canonicalUrl, jsonLdScript } from '$lib/seo';
	import { formatDate } from '$lib/utils/format';

	let { data } = $props();

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});
	const { author, publishedAt, tags, coverColor, translations, readingTimeMinutes, slug } =
		$derived(data.post);
	const { body, title, excerpt } = $derived(translations[lang]);
	const postUrl = $derived(canonicalUrl({ siteUrl: SITE_URL, pathname: page.url.pathname }));

	const paragraphs = $derived(
		body
			.split(/\n\n+/)
			.map((block) => block.trim())
			.filter(Boolean)
	);

	const tagLabels = $derived(
		tags.map((slug) => {
			const tag = data.tags.find((entry) => entry.slug === slug);
			return { slug, label: tag?.label[lang] ?? slug };
		})
	);

	const structuredData = $derived(
		jsonLdScript(
			articleJsonLd({
				url: postUrl,
				headline: title,
				description: excerpt,
				datePublished: publishedAt,
				authorName: author.name
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
					{ name: title, url: postUrl }
				])
			)
	);
</script>

<Meta {title} description={excerpt} ogType="article" image="{postUrl}/og.png" />

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- <-escaped JSON built in $lib/seo -->
	{@html structuredData}
</svelte:head>

<article class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div
		class="h-40 w-full rounded-lg sm:h-52"
		style:background-color={coverColor}
		aria-hidden="true"
	></div>

	<header class="flex flex-col gap-4">
		<div class="flex flex-wrap gap-1.5">
			{#each tagLabels as tag (tag.slug)}
				<TagBadge slug={tag.slug} label={tag.label} />
			{/each}
		</div>

		<Heading
			class="text-4xl leading-tight sm:text-5xl"
			style="view-transition-name: post-title-{slug}"
		>
			{title}
		</Heading>
		<p class="text-lg text-fg-muted">{excerpt}</p>

		<div class="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
			<AuthorAvatar name={author.name} color={author.avatarColor} size="md" />
			<span class="font-medium text-fg">{author.name}</span>
			<span aria-hidden="true">·</span>
			<time datetime={publishedAt}>{formatDate(publishedAt, lang)}</time>
			<span aria-hidden="true">·</span>
			<span>{$t('i18n.blog.readingTime', { minutes: readingTimeMinutes })}</span>
		</div>
	</header>

	<div
		class="prose max-w-none prose-neutral prose-p:text-fg prose-p:leading-relaxed dark:prose-invert dark:prose-p:text-fg"
	>
		{#each paragraphs as paragraph, index (index)}
			<p>{paragraph}</p>
		{/each}
	</div>
</article>
