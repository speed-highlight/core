<script>
	import '@fontsource-variable/dm-sans';
	import '@fontsource/fira-code/400.css';
	import '@fontsource/fira-code/500.css';
	import '../app.css';

	let { children } = $props();
</script>

<!-- the package's own description, see vite.config.js -->
<svelte:head>
	<title>speed-highlight</title>
	<meta name="description" content={__LIBRARY__.description}>
	<meta property="og:title" content="speed-highlight">
	<meta property="og:description" content={__LIBRARY__.description}>
</svelte:head>

{@render children()}
