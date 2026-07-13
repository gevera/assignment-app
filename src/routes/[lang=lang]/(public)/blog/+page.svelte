<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import { t } from '$lib/i18n';

	let { data } = $props();
</script>

<Meta title={$t('i18n.blog.title')} description={$t('i18n.blog.meta.description')} />

<h1>Blog</h1>
<pre>{JSON.stringify(data.posts, null, 2)}</pre>
