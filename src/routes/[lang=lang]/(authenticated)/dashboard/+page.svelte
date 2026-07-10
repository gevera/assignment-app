<script lang="ts">
	import { page } from '$app/state';
	import { localizedPath, t } from '$lib/i18n';

	const lang = $derived(page.params.lang ?? 'en');
</script>

<h1>{$t('i18n.dashboard.title')}</h1>
<p>
	<a href={localizedPath({ lang, path: '/dashboard/items' })}>{$t('i18n.dashboard.items.title')}</a>
</p>
