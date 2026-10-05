<script>
	import { highlightANSI } from '@speed-highlight/core';
	import Copy from './Copy.svelte';
	import { icon } from './languages.js';
	import Snippet from './Snippet.svelte';
	import { targetById, targets, withTheme } from './targets.js';
	import { terminalThemeMaps, terminalThemes, themePreviews } from './themes.js';

	let { target = $bindable(), termTheme = $bindable(), code, lang, theme } = $props();

	const current = $derived(targetById[target]);
	const files = $derived(current.files.map(file => ({ ...file, source: withTheme(file.source, { theme, termTheme }) })));
	// the manifest's first command, on the sample of the language in the editor
	const command = $derived(current.run?.[0].replace(/test\.\w+$/, `test.${lang}`));
	const fade = $derived(themePreviews[theme].bg);

	// the files unfolded by name, all folded again on another tab
	let expanded = $state({});
	function select(id) {
		target = id;
		expanded = {};
	}

	// the terminal is always dark, its tokens map onto one fixed palette
	const ansiPalette = { 30: '#3f4451', 31: '#e06c75', 32: '#98c379', 33: '#e5c07b', 34: '#61afef', 35: '#c678dd', 36: '#56b6c2', 37: '#e8e8ee', 90: '#7f8494' };
	const escapeHtml = str => str.replaceAll('&', '&#38;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
	const ansiToHtml = ansi => escapeHtml(ansi).replace(/\x1b\[(\d+)m([^\x1b]*)/g, (_, colorCode, text) =>
		ansiPalette[colorCode] ? `<span style="color:${ansiPalette[colorCode]}">${text}</span>` : text);

	// what the command prints, timed; only for the terminal targets
	async function runCommand(source, language, themeName) {
		const start = performance.now();
		const ansi = await highlightANSI(source, language, terminalThemeMaps[themeName]);
		return { html: ansiToHtml(ansi), ms: performance.now() - start };
	}
	const terminal = $derived(current.run ? await runCommand(code, lang, termTheme) : null);

	// arrow keys move between tabs, as the tabs pattern expects
	let tablist = $state();
	function onTabKeydown(event) {
		const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
		if (!move)
			return;
		const index = (targets.indexOf(current) + move + targets.length) % targets.length;
		select(targets[index].id);
		tablist.querySelectorAll('[role="tab"]')[index].focus();
	}
</script>

{#snippet header(iconUrl, title, copy, extra)}
	<div class="flex h-9 items-center gap-2 border-t border-line px-3 text-[12px] text-ink-dim">
		{#if iconUrl}
			<img class="size-3.5 shrink-0" src={iconUrl} alt="">
		{/if}
		<span class="font-mono text-ink">{title}</span>
		<span class="ml-auto flex items-center gap-2">
			{@render extra?.()}
			{#if copy}
				<Copy text={copy} label={title} />
			{/if}
		</span>
	</div>
{/snippet}

<section class="overflow-hidden rounded-xl border border-line bg-card" aria-labelledby="usage-title">
	<div class="flex items-center gap-3 px-3 pt-2.5 max-sm:flex-col max-sm:items-start">
		<h2 id="usage-title" class="text-[13px] font-semibold text-ink-strong">Use it</h2>
		<div bind:this={tablist} role="tablist" aria-label="Environment" tabindex="-1" onkeydown={onTabKeydown}
			class="thin-scroll -mb-px flex max-w-full items-center overflow-x-auto sm:ml-auto">
			{#each targets as option, index (option.id)}
				{#if index && option.run && !targets[index - 1].run}
					<span class="mx-1.5 h-4 w-px shrink-0 bg-line" aria-hidden="true"></span>
				{/if}
				<button
					type="button"
					role="tab"
					id="tab-{option.id}"
					aria-selected={option.id === target}
					aria-controls="usage-panel"
					tabindex={option.id === target ? 0 : -1}
					onclick={() => select(option.id)}
					class="tab group"
				>
					<img class="size-4 shrink-0" src={option.icon} alt="">
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<div id="usage-panel" role="tabpanel" aria-labelledby="tab-{target}" class="snippets mt-2.5">
		{#if current.install}
			{@render header(icon('npm'), 'install', current.install)}
			<Snippet code={current.install} lang="bash" />
		{/if}

		{#each files as file (file.name)}
			{@const lineCount = file.source.split('\n').length}
			<!-- a short file shows whole, folding away a couple of lines is not worth a click -->
			{@const collapsible = lineCount > 14}
			{@const open = expanded[file.name]}
			{@render header(file.icon, file.name, file.source)}
			<div class="relative">
				<div class={collapsible && !open ? 'max-h-60 overflow-hidden' : ''}>
					<Snippet code={file.source} lang={file.lang} />
				</div>
				{#if collapsible}
					<!-- floats over the fade like a toolbar button, the same chrome as the pickers -->
					<div class="flex justify-center pb-3 {open ? '' : 'absolute inset-x-0 bottom-0 items-end pt-14'}"
						style={open ? `background: ${fade}` : `background: linear-gradient(to bottom, transparent, ${fade} 75%)`}>
						<button type="button" onclick={() => expanded[file.name] = !open} aria-expanded={open} class="expand-button">
							<svg class="chevron {open ? 'rotate-180' : ''}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
							{open ? 'Show less' : `Show all ${lineCount} lines`}
						</button>
					</div>
				{/if}
			</div>
		{/each}

		{#if terminal}
			{#snippet themeSwitch()}
				<span class="flex items-center gap-0.5 rounded-md border border-line bg-page p-0.5" role="radiogroup" aria-label="Terminal theme">
					{#each terminalThemes as name (name)}
						<button type="button" role="radio" aria-checked={name === termTheme} onclick={() => termTheme = name}
							class="cursor-pointer rounded px-1.5 py-px font-mono text-[11px] text-ink-dim hover:text-ink aria-checked:bg-card aria-checked:text-ink-strong">{name}</button>
					{/each}
				</span>
				<span class="w-12 text-right tabular-nums">{terminal.ms.toFixed(terminal.ms >= 10 ? 0 : 1)} ms</span>
			{/snippet}
			{@render header(icon('shell'), 'terminal', command, themeSwitch)}
			<!-- a terminal always looks dark, regardless of the page mode, so the
			     dark tokens are forced locally instead of hardcoding new colors -->
			<div class="dark thin-scroll max-h-[300px] overflow-auto bg-page px-4 py-3.5 font-mono text-[12.5px]/[21px] whitespace-pre text-ink-strong"><span class="text-ink-dim select-none">{'$ '}</span>{`${command}\n`}{@html terminal.html}</div>
		{/if}
	</div>
</section>
