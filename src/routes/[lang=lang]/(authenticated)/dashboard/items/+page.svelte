<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { t } from '$lib/i18n';

	let { data } = $props();
</script>

<Meta
	title={$t('i18n.dashboard.items.title')}
	description={$t('i18n.dashboard.items.meta.description')}
	noindex
/>

<h1>Dashboard Data Table</h1>
{#await data.items}
	<pre>Loading…</pre>
{:then items}
	<pre>{JSON.stringify(items, null, 2)}</pre>
{/await}
