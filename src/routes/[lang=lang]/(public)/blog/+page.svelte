<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { BlogToolbar, PostCard, PostPager } from '$lib/components/blog';
	import { EmptyState, Heading } from '$ui';
	import { t } from '$lib/i18n';
	import type { Post, Tag } from '$lib/schemas';
	import type { BlogQuery } from '$lib/utils/posts-query';

	type Data = {
		posts: Post[];
		tags: Tag[];
		query: BlogQuery;
		total: number;
		page: number;
		perPage: number;
		pageCount: number;
	};

	let { data }: { data: Data } = $props();
	const { posts, tags, query, total, page, perPage, pageCount } = $derived(data);
</script>

<Meta title={$t('i18n.blog.title')} description={$t('i18n.blog.meta.description')} />

<section class="flex flex-col gap-8">
	<header class="max-w-2xl">
		<Heading>{$t('i18n.blog.title')}</Heading>
		<p class="mt-2 text-fg-muted">{$t('i18n.blog.meta.description')}</p>
	</header>

	<BlogToolbar {query} {tags} />

	{#if posts.length === 0}
		<EmptyState title={$t('i18n.blog.empty')} />
	{:else}
		<ul class="grid gap-5 md:grid-cols-2">
			{#each posts as post (post.id)}
				<li>
					<PostCard {post} {tags} class="h-full" />
				</li>
			{/each}
		</ul>

		{#if pageCount > 1}
			<PostPager {total} {pageCount} {perPage} currentPage={page} />
		{/if}
	{/if}
</section>
