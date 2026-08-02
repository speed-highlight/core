<script setup lang="ts">
import { ref } from 'vue';
import Code from './Code.vue';

const myCode = ref(`printf('Hello World!\n');`);
const myLang = ref('c');
</script>

<template>
	<p>Here is the example code:</p>
	<Code :code="myCode" :lang="myLang" />
</template>
