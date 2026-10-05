<script>
	import { langIcon, langName, languages, searchLanguages } from './languages.js';

	// a button that opens a searchable list; auto-detect is the first option,
	// next to the language it currently detects
	let { lang, detect, detected, onpick, ondetect } = $props();

	const AUTO = '\0auto';

	let open = $state(false);
	let query = $state('');
	let active = $state(0);
	let root = $state();
	let button = $state();
	let search = $state();
	let list = $state();

	const selected = $derived(detect ? AUTO : lang);
	const shown = $derived(detect ? detected : lang);
	const options = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const auto = !q || ['auto', 'detect'].some(word => word.startsWith(q));
		return [...(auto ? [AUTO] : []), ...searchLanguages(q)];
	});

	async function openList() {
		query = '';
		open = true;
		active = Math.max(0, options.indexOf(selected));
		await Promise.resolve();
		search.focus();
		scrollToActive('center');
	}

	function close(refocus = true) {
		open = false;
		if (refocus)
			button.focus();
	}

	function choose(option) {
		if (option === AUTO)
			ondetect();
		else if (option)
			onpick(option);
		close();
	}

	// only the list scrolls, scrollIntoView would move the page with it
	function scrollToActive(block = 'nearest') {
		const option = list?.querySelector(`[data-index="${active}"]`);
		if (!option)
			return;
		const top = option.offsetTop, bottom = top + option.offsetHeight;
		if (block === 'center')
			list.scrollTop = top - (list.clientHeight - option.offsetHeight) / 2;
		else if (top < list.scrollTop)
			list.scrollTop = top - 4;
		else if (bottom > list.scrollTop + list.clientHeight)
			list.scrollTop = bottom - list.clientHeight + 4;
	}

	function onKeydown(event) {
		const move = { ArrowDown: 1, ArrowUp: -1, PageDown: 8, PageUp: -8 }[event.key];
		if (move) {
			event.preventDefault();
			active = Math.min(options.length - 1, Math.max(0, active + move));
			scrollToActive();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			choose(options[active]);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			close();
		} else if (event.key === 'Tab') {
			close(false);
		}
	}

	// `/` opens the picker from anywhere but a text field, like most search boxes
	function onGlobalKeydown(event) {
		const typing = event.target.closest?.('input, textarea, [contenteditable]');
		if (event.key === '/' && !open && !typing && !event.metaKey && !event.ctrlKey) {
			event.preventDefault();
			openList();
		}
	}
</script>

<svelte:window
	onkeydown={onGlobalKeydown}
	onpointerdown={event => open && !root.contains(event.target) && close(false)} />

<div class="relative" bind:this={root}>
	<button
		bind:this={button}
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label="Language: {langName(shown)}{detect ? ', detected' : ''}"
		onclick={() => open ? close() : openList()}
		class="picker-button"
	>
		<img class="size-4 shrink-0" src={langIcon(shown)} alt="">
		<span class="max-w-36 truncate">{langName(shown)}</span>
		{#if detect}
			<span class="rounded-[5px] bg-line/70 px-1.5 py-px text-[10.5px] font-medium text-ink-dim">auto</span>
		{/if}
		<kbd class="ml-0.5 rounded border border-line px-1 font-sans text-[10.5px] leading-4 text-ink-dim max-sm:hidden">/</kbd>
		<svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
	</button>

	{#if open}
		<div class="popover w-72">
			<label class="flex items-center gap-2 border-b border-line px-3 text-ink-dim">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
				<input
					bind:this={search}
					bind:value={query}
					oninput={() => { active = 0; list.scrollTop = 0; }}
					onkeydown={onKeydown}
					role="combobox"
					aria-expanded="true"
					aria-controls="language-list"
					aria-activedescendant="language-option-{active}"
					aria-autocomplete="list"
					aria-label="Search languages"
					placeholder="Search {languages.length} languages"
					spellcheck="false"
					autocomplete="off"
					class="h-10 min-w-0 flex-1 bg-transparent text-[13px] text-ink-strong outline-none placeholder:text-ink-dim"
				>
			</label>

			<ul bind:this={list} id="language-list" role="listbox" aria-label="Languages" class="thin-scroll relative max-h-[min(20rem,60vh)] overflow-y-auto overscroll-contain p-1">
				{#each options as option, index (option)}
					<!-- the keyboard stays on the search input, which moves the
					     active option (aria-activedescendant), as the combobox
					     pattern has it; the pointer clicks options directly -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<li
						id="language-option-{index}"
						role="option"
						aria-selected={option === selected}
						data-index={index}
						data-active={index === active || undefined}
						onpointermove={() => active = index}
						onclick={() => choose(option)}
						class="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]
							{option === selected
								? 'bg-line/60 font-medium text-ink-strong'
								: 'text-ink data-active:bg-card data-active:text-ink-strong'}
							{option === AUTO && options.length > 1 ? 'relative mb-2 after:absolute after:inset-x-1 after:-bottom-1 after:h-px after:bg-line' : ''}"
					>
						{#if option === AUTO}
							<svg class="size-4 shrink-0 text-accent-ink" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3.5 11.6 8a3 3 0 0 0 1.9 1.9L18 11.5 13.5 13a3 3 0 0 0-1.9 1.9L10 19.5 8.4 15a3 3 0 0 0-1.9-1.9L2 11.5 6.5 10A3 3 0 0 0 8.4 8zM18.5 2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></svg>
							<span class="flex-1 truncate">Auto-detect</span>
							<span class="flex items-center gap-1 font-mono text-[11px] font-normal text-ink-dim">
								<img class="size-3" src={langIcon(detected)} alt="">{detected}
							</span>
						{:else}
							<img class="size-4 shrink-0" src={langIcon(option)} alt="">
							<span class="flex-1 truncate">{langName(option)}</span>
							<span class="font-mono text-[11px] font-normal text-ink-dim">{option}</span>
						{/if}
					</li>
				{:else}
					<li class="px-3 py-6 text-center text-[13px] text-ink-dim">No language matches “{query.trim()}”</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
