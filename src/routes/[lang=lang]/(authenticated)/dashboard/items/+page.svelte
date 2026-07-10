<script lang="ts">
	let { data } = $props();
</script>

<h1>Dashboard Data Table</h1>
{#await data.items}
	<pre>Loading…</pre>
{:then items}
	<pre>{JSON.stringify(items, null, 2)}</pre>
{/await}
