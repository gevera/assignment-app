<script lang="ts">
	import { Heading } from '$ui';
	import { t } from '$lib/i18n';

	const FEATURES = ['performance', 'i18n', 'a11y', 'insights'] as const;
</script>

<section aria-labelledby="features-title" class="flex flex-col gap-8">
	<Heading level={2} id="features-title">{$t('i18n.home.features.title')}</Heading>
	<ul class="grid gap-x-8 gap-y-10 sm:grid-cols-2">
		{#each FEATURES as feature (feature)}
			<li class="flex flex-col gap-2">
				<Heading level={3}>{$t(`i18n.home.features.${feature}.title`)}</Heading>
				<p class="text-fg-muted">{$t(`i18n.home.features.${feature}.description`)}</p>
			</li>
		{/each}
	</ul>
</section>
