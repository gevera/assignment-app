<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Badge } from '$ui';
	import { DEFAULT_LOCALE, isLocale } from '$lib/i18n';
	import { blogQueryPath, parseBlogQuery } from '$lib/utils/posts-query';

	type Props = {
		slug: string;
		label: string;
		class?: string;
	};

	let { slug, label, class: className = '' }: Props = $props();

	const lang = $derived.by(() => {
		const param = page.params.lang;
		return param && isLocale(param) ? param : DEFAULT_LOCALE;
	});

	function onClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		const onBlog = page.url.pathname === `/${lang}/blog`;
		const current = onBlog ? parseBlogQuery(page.url) : { page: 1, tag: '', sort: 'date' as const };

		void goto(
			resolve(
				blogQueryPath({
					lang,
					query: {
						page: 1,
						tag: slug,
						sort: current.sort
					}
				})
			)
		);
	}
</script>

<button type="button" class="cursor-pointer {className}" onclick={onClick}>
	<Badge variant="neutral">{label}</Badge>
</button>
