<script setup>
import { highlightText } from '@speed-highlight/core';
import '@speed-highlight/core/themes/default.css';
import { ref, watchEffect } from 'vue';

const props = defineProps({
	code: String,
	lang: String,
	multiline: { type: Boolean, default: true }
});

const html = ref('');

watchEffect(onCleanup => {
	let stale = false;

	highlightText(props.code, props.lang, props.multiline)
		.then(res => stale || (html.value = res));

	// a slow language import can resolve after the props changed
	onCleanup(() => stale = true);
});
</script>

<!--
	v-html is safe here: highlightText escapes &, < and > in every token before
	wrapping it (see sanitize in src/index.js), so the only markup in the result
	is the spans it added itself.
-->
<template>
	<div :class="`shj-lang-${lang} shj-${multiline ? 'multi' : 'one'}line`" v-html="html" />
</template>

<!-- <Code lang="js" :code="'const a = 1;'" /> -->
