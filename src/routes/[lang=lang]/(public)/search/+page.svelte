<script lang="ts">
	let { data } = $props();
</script>

<h1>Search</h1>
<pre>{JSON.stringify(data.posts, null, 2)}</pre>
<pre>{JSON.stringify(data.tags, null, 2)}</pre>
