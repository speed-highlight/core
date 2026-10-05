<script setup>
import { highlightHTML } from '@speed-highlight/core';
import '@speed-highlight/core/themes/default.css';
import { ref, watchEffect } from 'vue';

const props = defineProps({
	code: String,
	lang: String,
	block: { type: Boolean, default: true },
	showLineNumbers: Boolean
});

const html = ref('');

watchEffect(onCleanup => {
	let stale = false;

	highlightHTML(props.code, props.lang, { block: props.block, showLineNumbers: props.showLineNumbers })
		.then(res => stale || (html.value = res));

	// a slow language import can resolve after the props changed
	onCleanup(() => stale = true);
});
</script>

<!-- v-html is safe for any code, every token is escaped -->
<template>
	<div :class="`shj-lang-${lang} shj-${block ? 'block' : 'inline'}`" v-html="html" />
</template>
