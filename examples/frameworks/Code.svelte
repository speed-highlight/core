<script>
	import { highlightText } from '@speed-highlight/core';

	// svelte 5. on svelte 4, replace $props/$state/$effect with
	// `export let code, lang, multiline = true`, `let html = ''` and `$: { ... }`
	let { code, lang, multiline = true } = $props();
	let html = $state('');

	$effect(() => {
		let stale = false;

		highlightText(code, lang, multiline)
			.then(res => stale || (html = res));

		// a slow language import can resolve after the props changed
		return () => stale = true;
	});
</script>

<!--
	{@html} is safe here: highlightText escapes &, < and > in every token before
	wrapping it (see sanitize in src/index.js), so the only markup in the result
	is the spans it added itself.
-->
<div class="shj-lang-{lang} shj-{multiline ? 'multi' : 'one'}line">{@html html}</div>

<!-- <Code lang='js' code={'const a = 1;'} /> -->
