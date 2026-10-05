<script>
	import { highlightHTML } from '@speed-highlight/core';
	import '@speed-highlight/core/themes/default.css';

	let { code, lang, block = true, showLineNumbers = false } = $props();
	let html = $state('');

	$effect(() => {
		let stale = false;

		highlightHTML(code, lang, { block, showLineNumbers })
			.then(res => stale || (html = res));

		// a slow language import can resolve after the props changed
		return () => stale = true;
	});
</script>

<!-- {@html} is safe for any code, every token is escaped -->
<div class="shj-lang-{lang} shj-{block ? 'block' : 'inline'}">{@html html}</div>
