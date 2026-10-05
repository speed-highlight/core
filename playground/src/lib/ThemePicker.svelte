<script>
	import ThemeSwatch from './ThemeSwatch.svelte';
	import { themeGroups, themeLabel } from './themes.js';

	// hovering or focusing a theme previews it live, leaving restores the pick
	let { theme, onpick, onpreview } = $props();

	let open = $state(false);
	let root = $state();
	let button = $state();
	let panel = $state();

	async function openPanel() {
		open = true;
		await Promise.resolve();
		panel?.querySelector('[aria-pressed="true"]')?.focus();
	}

	function close(refocus = true) {
		open = false;
		onpreview(null);
		if (refocus)
			button.focus();
	}

	function pick(name) {
		onpick(name);
		close();
	}
</script>

<svelte:window onpointerdown={event => open && !root.contains(event.target) && close(false)} />

<div class="relative" bind:this={root}>
	<button
		bind:this={button}
		type="button"
		aria-haspopup="dialog"
		aria-expanded={open}
		onclick={() => open ? close() : openPanel()}
		class="picker-button"
	>
		<ThemeSwatch name={theme} small />
		<span class="max-sm:hidden">{themeLabel(theme)}</span>
		<svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
	</button>

	{#if open}
		<div
			bind:this={panel}
			class="popover w-[352px] max-w-[calc(100vw-2.5rem)] p-3"
			role="dialog"
			aria-label="Theme"
			tabindex="-1"
			onkeydown={event => event.key === 'Escape' && close()}
			onmouseleave={() => onpreview(null)}
			onfocusout={event => !root.contains(event.relatedTarget) && close(false)}
		>
			{#each Object.entries(themeGroups) as [group, names] (group)}
				<div class="mb-1.5 px-0.5 text-[11px] font-medium tracking-wide text-ink-dim uppercase not-first:mt-3">{group}</div>
				<div class="grid grid-cols-4 gap-2">
					{#each names as name (name)}
						<button
							type="button"
							aria-pressed={name === theme}
							class="group flex cursor-pointer flex-col items-stretch gap-1 rounded-lg p-1 outline-none hover:bg-card focus-visible:bg-card"
							onclick={() => pick(name)}
							onmouseenter={() => onpreview(name)}
							onfocus={() => onpreview(name)}
						>
							<span class="rounded-md group-aria-pressed:outline-2 group-aria-pressed:outline-offset-1 group-aria-pressed:outline-accent">
								<ThemeSwatch {name} />
							</span>
							<span class="truncate text-center text-[11px] text-ink-dim group-hover:text-ink group-aria-pressed:text-ink-strong">{themeLabel(name)}</span>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>
