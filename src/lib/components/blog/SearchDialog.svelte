<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { match, P } from 'ts-pattern';
	import { Dialog, Input, Toggle } from '$ui';
	import AuthorAvatar from './AuthorAvatar.svelte';
	import { closeSearchDialog, filtersToQuery, syncSearchDialogUrl } from '$lib/search/dialog';
	import { DEFAULT_LOCALE, isLocale, localizedPath, t } from '$lib/i18n';
	import type { Post } from '$lib/schemas';
	import { formatDate } from '$lib/utils/format';
	import { searchKeyCommand } from '$lib/utils/matchers';
	import { postsQueryPath, type PostsQuery } from '$lib/utils/posts-query-path';

	type SearchResponse = {
		posts: Post[];
		total: number;
	};

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});

	const open = $derived(Boolean(page.state.searchOpen));

	let q = $state('');
	let tag = $state('');
	let fuzzy = $state(false);
	let posts = $state<Post[]>([]);
	let total = $state(0);
	let loading = $state(false);
	let activeIndex = $state(0);
	let seededForOpen = $state(false);
	let debounceId: ReturnType<typeof setTimeout> | undefined;
	let requestId = 0;

	$effect(() => {
		if (!open) {
			seededForOpen = false;
			return;
		}
		if (seededForOpen) return;
		const params = page.url.searchParams;
		q = params.get('q') ?? '';
		tag = params.get('tag') ?? '';
		fuzzy = params.get('fuzzy') === '1' || params.get('fuzzy') === 'true';
		seededForOpen = true;
	});

	$effect(() => {
		if (!open) return;

		const query = filtersToQuery({ q, tag, fuzzy });
		const id = ++requestId;
		loading = true;

		clearTimeout(debounceId);
		debounceId = setTimeout(() => {
			syncSearchDialogUrl(query);
			void fetchResults(query, id);
		}, 200);

		return () => clearTimeout(debounceId);
	});

	/** Fetches search results from the posts API and updates the dialog state. */
	async function fetchResults(query: PostsQuery, id: number) {
		try {
			const path = resolve(postsQueryPath({ lang, query }));
			const response = await fetch(path);
			if (!response.ok) throw new Error($t('i18n.common.error'));
			const data = (await response.json()) as SearchResponse;
			if (id !== requestId) return;
			posts = data.posts;
			total = data.total;
			activeIndex = 0;
		} catch {
			if (id !== requestId) return;
			posts = [];
			total = 0;
		} finally {
			if (id === requestId) loading = false;
		}
	}

	/** Closes the search dialog. */
	function onClose() {
		closeSearchDialog();
	}

	/** Navigates to the blog post with the given slug. */
	function selectPost(slug: string) {
		void goto(localizedPath({ lang, path: `/blog/${slug}` }));
	}

	/** Clears the active tag filter. */
	function clearTag() {
		tag = '';
	}

	/** Extracts tag name and role from an event target for keyboard handling. */
	function searchTargetInfo(target: EventTarget | null) {
		return match(target)
			.with(P.instanceOf(Element), (el) => ({
				tagName: el.tagName,
				role: el.getAttribute('role')
			}))
			.otherwise(() => ({}));
	}

	/** Handles global keyboard shortcuts and navigation within search results. */
	function onWindowKeydown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') return;

		match(
			searchKeyCommand({
				key: event.key,
				ctrlOrMeta: false,
				open,
				activeIndex,
				length: posts.length,
				target: searchTargetInfo(event.target)
			})
		)
			.with({ kind: 'toggle' }, () => undefined)
			.with({ kind: 'focus', index: P.select() }, (index) => {
				event.preventDefault();
				activeIndex = index;
			})
			.with({ kind: 'select', index: P.select() }, (index) => {
				const post = posts[index];
				if (!post) return;
				event.preventDefault();
				selectPost(post.slug);
			})
			.with({ kind: 'noop' }, () => undefined)
			.exhaustive();
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

<Dialog {open} title={$t('i18n.nav.search')} {onClose}>
	<div
		class="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg"
		role="search"
	>
		<div class="flex items-center gap-2 border-b border-border px-3 py-2">
			<Input
				type="search"
				class="border-0 bg-transparent shadow-none focus-visible:ring-2 focus-visible:ring-focus/40"
				placeholder={$t('i18n.search.placeholder')}
				bind:value={q}
				aria-label={$t('i18n.search.placeholder')}
				autocomplete="off"
			/>
			<Toggle bind:checked={fuzzy} label={$t('i18n.search.fuzzy')} />
		</div>

		{#if tag}
			<div class="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-fg-muted">
				<span>{$t('i18n.search.tagFilter', { tag })}</span>
				<button type="button" class="underline hover:text-fg" onclick={clearTag}>
					{$t('i18n.common.cancel')}
				</button>
			</div>
		{/if}

		<div
			class="max-h-[min(24rem,50vh)] overflow-y-auto py-1"
			role="listbox"
			aria-label={$t('i18n.nav.search')}
		>
			{#if loading && posts.length === 0}
				<p class="px-4 py-6 text-sm text-fg-muted">{$t('i18n.common.loading')}</p>
			{:else if posts.length === 0}
				<p class="px-4 py-6 text-sm text-fg-muted">{$t('i18n.search.noResults')}</p>
			{:else}
				{#if !q && !tag}
					<p class="px-4 pt-2 pb-1 text-xs font-medium tracking-wide text-fg-muted uppercase">
						{$t('i18n.search.recent')}
					</p>
				{:else if q}
					<p class="px-4 pt-2 pb-1 text-xs text-fg-muted">
						{$t('i18n.search.results', { count: total, query: q })}
					</p>
				{/if}

				{#each posts as { id, slug, translations, coverColor, author, publishedAt }, index (id)}
					{@const { title, excerpt } = translations[lang]}
					<button
						type="button"
						role="option"
						aria-selected={index === activeIndex}
						class="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors {index ===
						activeIndex
							? 'bg-[color-mix(in_oklab,var(--fg)_8%,var(--surface-elevated))]'
							: 'hover:bg-[color-mix(in_oklab,var(--fg)_5%,var(--surface-elevated))]'}"
						onmouseenter={() => (activeIndex = index)}
						onclick={() => selectPost(slug)}
					>
						<span
							class="mt-1 size-2.5 shrink-0 rounded-full"
							style:background-color={coverColor}
							aria-hidden="true"
						></span>
						<span class="min-w-0 flex-1">
							<span class="block truncate font-medium text-fg">{title}</span>
							<span class="mt-0.5 line-clamp-1 text-xs text-fg-muted">{excerpt}</span>
							<span class="mt-1 flex items-center gap-1.5 text-xs text-fg-muted">
								<AuthorAvatar name={author.name} color={author.avatarColor} />
								<span>{author.name}</span>
								<span aria-hidden="true">·</span>
								<time datetime={publishedAt}>{formatDate(publishedAt, lang)}</time>
							</span>
						</span>
					</button>
				{/each}
			{/if}
		</div>

		<div class="border-t border-border px-4 py-2 text-xs text-fg-muted">
			{$t('i18n.search.shortcut')}
		</div>
	</div>
</Dialog>
