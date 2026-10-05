<script>
	let { text, label = text } = $props();

	let copied = $state(false);
	let timer;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// clipboard api needs a focused document, fall back to the
			// selection based approach
			const helper = document.body.appendChild(Object.assign(document.createElement('textarea'), { value: text }));
			helper.select();
			document.execCommand('copy');
			helper.remove();
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => copied = false, 1200);
	}
</script>

<button
	type="button"
	class="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-dim hover:bg-line/40 hover:text-ink"
	aria-label="Copy {label}"
	title="Copy"
	onclick={copy}
>
	{#if copied}
		<svg class="text-accent-ink" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
	{:else}
		<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
	{/if}
</button>
