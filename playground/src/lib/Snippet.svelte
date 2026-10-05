<script>
	import { highlightHTML } from '@speed-highlight/core';

	// read-only code in the picked theme
	let { code, lang, inline = false } = $props();

	const html = $derived(await highlightHTML(code, lang, { block: !inline }));
</script>

{#if inline}
	<span class="shj-lang-{lang} shj-inline">{@html html}</span>
{:else}
	<div class="shj-lang-{lang} shj-block">{@html html}</div>
{/if}
