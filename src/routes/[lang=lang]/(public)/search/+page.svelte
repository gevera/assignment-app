<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { t } from '$lib/i18n';

	let { data } = $props();
</script>

<Meta title={$t('i18n.nav.search')} description={$t('i18n.search.meta.description')} noindex />

<h1>Search</h1>
<pre>{JSON.stringify(data.posts, null, 2)}</pre>
<pre>{JSON.stringify(data.tags, null, 2)}</pre>
