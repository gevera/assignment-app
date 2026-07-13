<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import {
		FeaturesSection,
		HeroSection,
		PricingSection,
		SocialSection
	} from '$lib/components/home';
	import { t } from '$lib/i18n';
	import { SITE_URL, jsonLdScript, organizationJsonLd } from '$lib/seo';

	const organizationScript = jsonLdScript(organizationJsonLd({ siteUrl: SITE_URL }));
</script>

<Meta title={$t('i18n.home.meta.title')} description={$t('i18n.home.meta.description')} />

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, <-escaped JSON built in $lib/seo -->
	{@html organizationScript}
</svelte:head>

<div class="flex flex-col gap-20 sm:gap-24">
	<HeroSection />
	<FeaturesSection />
	<PricingSection />
	<SocialSection />
</div>
