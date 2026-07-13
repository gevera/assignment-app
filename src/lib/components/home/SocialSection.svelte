<script lang="ts">
	import { Card, Heading } from '$ui';
	import { t } from '$lib/i18n';

	const STATS = ['uptime', 'teams', 'countries'] as const;
	const TESTIMONIALS = ['t1', 't2', 't3'] as const;
</script>

<section aria-labelledby="social-title" class="flex flex-col gap-8">
	<Heading level={2} id="social-title">{$t('i18n.home.social.title')}</Heading>
	<dl class="gap-10 text-center sm:gap-20 flex flex-wrap justify-center my-10">
		{#each STATS as stat (stat)}
			<div class="flex flex-col-reverse justify-end gap-1">
				<dt class="text-sm text-fg-muted">{$t(`i18n.home.social.stat.${stat}.label`)}</dt>
				<dd class="font-display text-3xl font-semibold text-fg">
					{$t(`i18n.home.social.stat.${stat}.value`)}
				</dd>
			</div>
		{/each}
	</dl>
	<ul class="grid gap-4 md:grid-cols-3">
		{#each TESTIMONIALS as testimonial (testimonial)}
			<li class="flex">
				<Card class="flex w-full flex-col">
					<figure class="flex grow flex-col gap-4">
						<blockquote class="grow text-fg">
							<p>“{$t(`i18n.home.social.testimonial.${testimonial}.quote`)}”</p>
						</blockquote>
						<figcaption class="text-sm">
							<span class="font-medium text-fg">
								{$t(`i18n.home.social.testimonial.${testimonial}.author`)}
							</span>
							<span class="text-fg-muted">
								· {$t(`i18n.home.social.testimonial.${testimonial}.role`)}
							</span>
						</figcaption>
					</figure>
				</Card>
			</li>
		{/each}
	</ul>
</section>
