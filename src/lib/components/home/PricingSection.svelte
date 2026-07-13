<script lang="ts">
	import { page } from '$app/state';
	import { Badge, Button, Card, Heading } from '$ui';
	import { localizedPath, t } from '$lib/i18n';

	const lang = $derived(page.data.lang ?? page.params.lang ?? 'en');
	const loginHref = $derived(localizedPath({ lang, path: '/login' }));

	const TIERS = [
		{ id: 'starter', featured: false },
		{ id: 'team', featured: true },
		{ id: 'enterprise', featured: false }
	] as const;
	const BULLETS = [1, 2, 3] as const;
</script>

<section id="pricing" aria-labelledby="pricing-title" class="flex scroll-mt-24 flex-col gap-8">
	<div class="flex flex-col gap-2">
		<Heading level={2} id="pricing-title">{$t('i18n.home.pricing.title')}</Heading>
		<p class="text-fg-muted">{$t('i18n.home.pricing.subtitle')}</p>
	</div>
	<ul class="grid items-stretch gap-4 lg:grid-cols-3">
		{#each TIERS as tier (tier.id)}
			<li class="flex">
				<Card variant={tier.featured ? 'featured' : 'default'} class="flex w-full flex-col gap-6">
					<div class="flex items-center justify-between gap-2">
						<Heading level={3}>{$t(`i18n.home.pricing.tier.${tier.id}.name`)}</Heading>
						{#if tier.featured}
							<Badge variant="accent">{$t('i18n.home.pricing.popular')}</Badge>
						{/if}
					</div>
					<p class="flex items-baseline gap-2">
						<span class="font-display text-4xl font-semibold text-fg">
							{$t(`i18n.home.pricing.tier.${tier.id}.price`)}
						</span>
						<span class="text-sm text-fg-muted">
							{$t(`i18n.home.pricing.tier.${tier.id}.period`)}
						</span>
					</p>
					<ul class="flex grow flex-col gap-2 text-sm text-fg-muted">
						{#each BULLETS as bullet (bullet)}
							<li>{$t(`i18n.home.pricing.tier.${tier.id}.feature${bullet}`)}</li>
						{/each}
					</ul>
					{#if tier.featured}
						<Button href={loginHref} class="w-full">
							{$t(`i18n.home.pricing.tier.${tier.id}.cta`)}
						</Button>
					{:else}
						<Button
							variant="ghost"
							href={loginHref}
							class="w-full rounded-md border border-border"
						>
							{$t(`i18n.home.pricing.tier.${tier.id}.cta`)}
						</Button>
					{/if}
				</Card>
			</li>
		{/each}
	</ul>
</section>
