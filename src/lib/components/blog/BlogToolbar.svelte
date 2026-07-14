<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DEFAULT_LOCALE, isLocale, t } from '$lib/i18n';
	import type { Tag } from '$lib/schemas';
	import { blogQueryPath, type BlogQuery, type BlogSort } from '$lib/utils/posts-query';

	type Props = {
		query: BlogQuery;
		tags: Tag[];
	};

	let { query, tags }: Props = $props();
	const { sort, tag: queryTag } = $derived(query);

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});

	const activeTag = $derived.by(() => {
		if (!queryTag) return null;
		const tag = tags.find((entry) => entry.slug === queryTag);
		return {
			slug: queryTag,
			label: tag?.label[lang] ?? queryTag
		};
	});

	/** Navigates to the blog index with the given query parameters. */
	function navigate(next: BlogQuery) {
		void goto(resolve(blogQueryPath({ lang, query: next })), {
			keepFocus: true,
			noScroll: true
		});
	}

	/** Removes the tag filter and resets to page one. */
	function clearTag() {
		navigate({ ...query, tag: '', page: 1 });
	}

	/** Changes the blog sort order when a different option is selected. */
	function setSort(blogSort: BlogSort) {
		if (blogSort === sort) return;
		navigate({ ...query, sort: blogSort, page: 1 });
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-3">
	<div class="flex min-h-8 items-center">
		{#if activeTag}
			<div
				class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-0.5 pr-1 pl-2.5"
			>
				<span class="text-xs font-medium text-fg-muted">
					{$t('i18n.search.tagFilter', { tag: activeTag.label })}
				</span>
				<button
					type="button"
					class="inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-elevated hover:text-fg"
					aria-label={$t('i18n.blog.filter.clear')}
					onclick={clearTag}
				>
					<span aria-hidden="true">×</span>
				</button>
			</div>
		{/if}
	</div>

	<div
		class="inline-flex h-8 items-center rounded-full border border-border bg-surface p-0.5"
		role="group"
		aria-label={$t('i18n.blog.sort.label')}
	>
		<button
			type="button"
			aria-pressed={sort === 'date'}
			onclick={() => setSort('date')}
			class="inline-flex h-7 cursor-pointer items-center justify-center rounded-full px-2.5 text-xs tracking-wide transition-colors {sort ===
			'date'
				? 'bg-surface-elevated font-semibold text-fg shadow-sm'
				: 'font-medium text-fg-muted hover:text-fg'}"
		>
			{$t('i18n.blog.sort.published')}
		</button>
		<button
			type="button"
			aria-pressed={sort === 'title'}
			onclick={() => setSort('title')}
			class="inline-flex h-7 cursor-pointer items-center justify-center rounded-full px-2.5 text-xs tracking-wide transition-colors {sort ===
			'title'
				? 'bg-surface-elevated font-semibold text-fg shadow-sm'
				: 'font-medium text-fg-muted hover:text-fg'}"
		>
			{$t('i18n.blog.sort.title')}
		</button>
	</div>
</div>
