<script>
	import Code from './Code.svelte';

	const code = `const tag = '<b>' + "&";\nconsole.log(tag);`;
</script>

<Code lang="js" {code} showLineNumbers />
<Code lang="js" code="const a = 1;" block={false} />
