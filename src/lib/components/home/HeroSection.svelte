<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$ui';
	import { localizedPath, t } from '$lib/i18n';

	const lang = $derived(page.data.lang ?? page.params.lang ?? 'en');
	const loginHref = $derived(localizedPath({ lang, path: '/login' }));
	const blogHref = $derived(localizedPath({ lang, path: '/blog' }));
</script>

<section aria-labelledby="hero-title" class="py-10 text-center sm:py-16">
	<div class="mx-auto flex max-w-2xl flex-col items-center gap-6">
		<h1
			id="hero-title"
			class="font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl"
		>
			{$t('i18n.home.hero.title')}
		</h1>
		<p class="text-lg text-fg-muted">{$t('i18n.home.hero.subtitle')}</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<Button href={loginHref}>{$t('i18n.home.hero.cta')}</Button>
			<Button variant="ghost" href={blogHref}>{$t('i18n.home.hero.ctaSecondary')}</Button>
		</div>
	</div>
</section>
