<script lang="ts">
	let { data } = $props();
</script>

<h1>Blog Post</h1>
<pre>{JSON.stringify(data.post, null, 2)}</pre>
