<script>
	import { themePreviews } from './themes.js';

	// a fake code block painted with the theme's real colors
	let { name, small = false } = $props();

	// three lines of code, as the token and the width of each word
	const lines = [[['kwd', '25%'], ['func', '40%']], [['num', '20%'], ['str', '50%']], [['cmnt', '40%']]];

	const preview = $derived(themePreviews[name]);
</script>

<span
	class="flex shrink-0 flex-col justify-center rounded-md border border-line {small ? 'h-5 w-7 gap-[3px] rounded px-1' : 'h-11 w-full gap-[5px] px-2'}"
	style="background: {preview.bg}"
>
	{#each lines as words, index (index)}
		<span class="flex gap-[3px]">
			{#each words as [token, width] (token)}
				<i class="rounded-full {small ? 'h-[2px]' : 'h-1'}" style="width: {width}; background: {preview[token]}"></i>
			{/each}
		</span>
	{/each}
</span>
