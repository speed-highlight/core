<script>
	import { detectLanguage } from '@speed-highlight/core/detect';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Copy from '#lib/Copy.svelte';
	import Editor from '#lib/Editor.svelte';
	import LanguagePicker from '#lib/LanguagePicker.svelte';
	import { defaultLang, defaultSample, languages, loadSample } from '#lib/languages.js';
	import Snippet from '#lib/Snippet.svelte';
	import { install, targetById } from '#lib/targets.js';
	import ThemePicker from '#lib/ThemePicker.svelte';
	import { isDarkTheme, terminalThemes, themeCss, themeGroups, themePreviews, themes } from '#lib/themes.js';
	import Toggle from '#lib/Toggle.svelte';
	import Usage from '#lib/Usage.svelte';

	// the code theme that goes with each page mode
	const modeTheme = { light: 'default', dark: 'atom-dark' };
	const defaultTarget = 'node';

	// the page is prerendered in its default state, and the browser hydrates
	// that html as is: the state a link or the device asks for is applied
	// once mounted, never during the first render
	let lang = $state(defaultLang);
	let dark = $state(false);
	let theme = $state(modeTheme.light);
	let previewTheme = $state(null);
	let termTheme = $state('default');
	let target = $state(defaultTarget);
	let detect = $state(false);
	let numbers = $state(true);
	let code = $state(defaultSample);
	let ms = $state(null);
	let mounted = $state(false);

	const coreSize = `${(__LIBRARY__.coreGzip / 1000).toFixed(1)} kB`;

	// always computed, the picker shows what auto-detect would pick even
	// while a language is chosen by hand
	const detectedLang = $derived(detectLanguage(code));
	const activeLang = $derived(detect ? detectedLang : lang);
	const shownTheme = $derived(previewTheme ?? theme);

	// samples load async, only the last language asked for may fill the editor
	async function showSample(name) {
		const sample = await loadSample(name);
		if (name === lang)
			code = sample;
	}

	function pickLanguage(name) {
		detect = false;
		lang = name;
		showSample(name);
	}

	onMount(() => {
		const initial = new URLSearchParams(location.hash.slice(1));
		const pickOr = (list, value, fallback) => list.includes(value) ? value : fallback;

		// device preference by default, the user's choice is remembered; the
		// same key app.html reads to set the mode before the first paint
		const storedDark = localStorage.getItem('shj-dark');
		dark = storedDark !== null ? storedDark === '1' : matchMedia('(prefers-color-scheme: dark)').matches;

		lang = pickOr(languages, initial.get('lang'), defaultLang);
		theme = pickOr(themes, initial.get('theme'), modeTheme[dark ? 'dark' : 'light']);
		termTheme = pickOr(terminalThemes, initial.get('termTheme'), termTheme);
		target = pickOr(Object.keys(targetById), initial.get('target'), defaultTarget);
		detect = initial.has('detect');
		if (initial.has('code'))
			code = initial.get('code');
		else if (lang !== defaultLang)
			showSample(lang);
		mounted = true;
	});

	// only the page mode is a device preference, the highlighting themes
	// travel in the url so a shared link looks the same for everyone
	$effect(() => {
		if (!mounted)
			return;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('shj-dark', dark ? '1' : '0');
	});

	function toggleDark() {
		dark = !dark;
		// switch the code theme in tandem unless it already matches the mode
		const mode = dark ? 'dark' : 'light';
		if (!themeGroups[mode].includes(theme))
			theme = modeTheme[mode];
	}

	// the shareable url follows debounced, and only keeps picks, not previews
	$effect(() => {
		if (!mounted)
			return;
		const params = new URLSearchParams({ lang, theme, target, termTheme, ...(detect && { detect: 1 }) });
		if (code.length < 4000)
			params.set('code', code);
		const timer = setTimeout(() => goto(`#${params}`, { shallow: true, replace: true }), 200);
		return () => clearTimeout(timer);
	});
</script>

<!-- the active code theme is global css, one style tag swapped with it -->
<svelte:head>
	{@html `<style>${themeCss[shownTheme]}</style>`}
</svelte:head>

{#snippet githubMark(size)}
	<svg width={size} height={size} viewBox="0 0 98 96" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
{/snippet}

<div class="flex min-h-screen flex-col">
<header class="sticky top-0 z-40 h-16 shrink-0 border-b border-line bg-card/85 backdrop-blur-md">
	<div class="mx-auto flex h-full w-full max-w-[1060px] items-center gap-2.5 px-5">
		<a href="./" class="text-[19px] font-bold tracking-tight text-ink-strong">speed-highlight</a>
		<nav class="ml-auto flex gap-1">
			<a class="icon-button" href="https://www.npmjs.com/package/@speed-highlight/core" target="_blank" rel="noopener" aria-label="npm package" title="npm">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>
			</a>
			<a class="icon-button" href="https://github.com/speed-highlight/core" target="_blank" rel="noopener" aria-label="GitHub repository" title="GitHub">
				{@render githubMark(17)}
			</a>
			<button class="icon-button cursor-pointer" onclick={toggleDark} aria-label="Toggle light or dark mode" title="Toggle theme">
				{#if dark}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm0-19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1zm11 11a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm15.07 7.07a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41zM7.05 7.05a1 1 0 0 1-1.41 0l-.71-.71A1 1 0 0 1 6.34 4.93l.71.71a1 1 0 0 1 0 1.41zm12.02-2.12a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0zM7.05 16.95a1 1 0 0 1 0 1.41l-.71.71a1 1 0 0 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0z"/></svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
				{/if}
			</button>
		</nav>
	</div>
</header>

<section>
	<div class="mx-auto max-w-[1060px] px-5 pt-20 pb-14 text-center max-sm:pt-12 max-sm:pb-10">
		<h1 class="mx-auto max-w-3xl text-[52px]/[1.05] font-bold tracking-[-0.035em] text-balance text-ink-strong max-sm:text-[36px]">
			speed-highlight
		</h1>
		<p class="mx-auto mt-5 max-w-[520px] text-[17px]/[1.6] text-pretty text-ink-dim">{__LIBRARY__.description}</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-2.5">
			<a href="https://github.com/speed-highlight/core" target="_blank" rel="noopener" class="flex h-10 items-center gap-2 rounded-lg bg-ink-strong px-4 text-[14px] font-medium text-page transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
				{@render githubMark(16)}
				Star on GitHub
			</a>
			<!-- drawn by the library in the picked theme, like every snippet -->
			<span class="hero-install flex h-10 items-center gap-2 rounded-lg bg-card pr-1.5 pl-3.5 font-mono text-[13px] text-ink-strong">
				<span class="text-ink-dim select-none">$</span>
				<Snippet code={install} lang="bash" inline />
				<Copy text={install} />
			</span>
		</div>
		<dl class="mx-auto mt-11 flex max-w-[620px] flex-wrap items-center justify-center gap-x-9 gap-y-3 text-[13.5px] max-sm:max-w-[300px] max-sm:gap-x-6">
			{#each [[coreSize, 'core, gzipped'], [languages.length, 'languages'], [themes.length, 'themes'], [__LIBRARY__.dependencies, 'dependencies']] as [value, label] (label)}
				<div class="flex items-baseline gap-1.5">
					<dt class="order-2 text-ink-dim">{label}</dt>
					<dd class="font-semibold text-ink-strong tabular-nums">{value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<main class="mx-auto w-full max-w-[1060px] flex-1 px-5 pt-2 pb-10">
	<Usage bind:target bind:termTheme {code} lang={activeLang} theme={shownTheme} />

	<div class="flex flex-wrap items-center gap-2 pt-8 pb-1">
		<LanguagePicker {lang} {detect} detected={detectedLang}
			onpick={pickLanguage}
			ondetect={() => detect = true} />
		<ThemePicker {theme}
			onpick={name => { theme = name; previewTheme = null; }}
			onpreview={name => previewTheme = name} />
		<span class="ml-auto flex items-center gap-4">
			<Toggle bind:checked={numbers} label="Line numbers" />
			<span class="w-14 text-right font-mono text-[11.5px] text-ink-dim tabular-nums" title="Time to highlight">
				{ms === null ? '' : `${ms >= 10 ? ms.toFixed(0) : ms.toFixed(1)} ms`}
			</span>
		</span>
	</div>

	<Editor bind:code lang={activeLang} {numbers}
		caret={themePreviews[shownTheme].text}
		darkTooltip={isDarkTheme(shownTheme)}
		onms={value => ms = value} />

	<footer class="pt-8 text-[12.5px] text-ink-dim">
		Icons from <a class="underline hover:text-ink" href="https://github.com/BeardedBear/bearded-icons" target="_blank" rel="noopener">Bearded Icons</a>,
		Deno logo from <a class="underline hover:text-ink" href="https://simpleicons.org" target="_blank" rel="noopener">Simple Icons</a>.
	</footer>
</main>
</div>
