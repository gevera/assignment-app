<script lang="ts">
	let { data } = $props();
</script>

<h1>Blog</h1>
<pre>{JSON.stringify(data.posts, null, 2)}</pre>
