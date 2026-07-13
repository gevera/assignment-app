<script lang="ts">
	import { page } from '$app/state';
	import { Button, Card, Heading } from '$ui';
	import { AuthorAvatar, TagBadge } from '$lib/components/blog';
	import { DEFAULT_LOCALE, isLocale, localizedPath, t } from '$lib/i18n';
	import type { Post, Tag } from '$lib/schemas';
	import { formatDate } from '$lib/utils/format';

	type Props = {
		post: Post;
		tags: Tag[];
		class?: string;
	};

	let { post, tags, class: className = '' }: Props = $props();

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});

	const { author, publishedAt, readingTimeMinutes } = $derived(post);

	const { title, excerpt } = $derived(post.translations[lang]);
	const href = $derived(localizedPath({ lang, path: `/blog/${post.slug}` }));

	const tagLabels = $derived(
		post.tags.map((slug) => {
			const tag = tags.find((entry) => entry.slug === slug);
			return { slug, label: tag?.label[lang] ?? slug };
		})
	);
</script>

<Card class="flex flex-col overflow-hidden p-0 {className}">
	<a
		{href}
		class="block h-2 w-full"
		style:background-color={post.coverColor}
		aria-hidden="true"
		tabindex="-1"
	></a>

	<div class="flex flex-1 flex-col gap-3 p-5">
		<div class="flex flex-wrap gap-1.5">
			{#each tagLabels as { label, slug } (slug)}
				<TagBadge {slug} {label} />
			{/each}
		</div>

		<div class="flex flex-1 flex-col gap-2">
			<Heading level={2} class="text-xl">
				<a {href} class="text-fg hover:underline">{title}</a>
			</Heading>
			<p class="line-clamp-3 text-sm leading-relaxed text-fg-muted">{excerpt}</p>
		</div>

		<div
			class="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"
		>
			<div class="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
				<AuthorAvatar {author} />
				<span class="font-medium text-fg">{author.name}</span>
				<span aria-hidden="true">·</span>
				<time datetime={publishedAt}>{formatDate(publishedAt, lang)}</time>
				<span aria-hidden="true">·</span>
				<span>{$t('i18n.blog.readingTime', { minutes: readingTimeMinutes })}</span>
			</div>
			<Button variant="ghost" {href} class="shrink-0">{$t('i18n.blog.readMore')}</Button>
		</div>
	</div>
</Card>
