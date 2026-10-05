<script setup>
import Code from './Code.vue';

const code = `const tag = '<b>' + "&";\nconsole.log(tag);`;
</script>

<template>
	<Code lang="js" :code="code" show-line-numbers />
	<Code lang="js" code="const a = 1;" :block="false" />
</template>
