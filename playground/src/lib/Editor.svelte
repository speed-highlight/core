<script>
	import { highlightHTML } from '@speed-highlight/core';
	import { untrack } from 'svelte';

	let { code = $bindable(), lang, numbers = true, caret, darkTooltip = false, onms } = $props();

	let mirror = $state();
	let input = $state();
	let textX = $state(0);
	let textY = $state(0);
	let codeSize = $state('');
	let codeLh = $state('');
	let codePad = $state('');
	let tooltip = $state(null);

	// timed, the toolbar shows how long the highlighting takes
	async function highlight(source, language, showLineNumbers) {
		const start = performance.now();
		const html = await highlightHTML(source, language, { showLineNumbers });
		return { html, ms: performance.now() - start };
	}

	// the trailing zero-width space goes through the highlighter so it lands
	// inside the code column, keeping the last line's height when the code
	// ends with a newline. Awaited, a result never lands over a newer one
	const highlighted = $derived(await highlight(code + '\u200b', lang, numbers));

	$effect(() => {
		onms?.(highlighted.ms);
		// the hovered token belonged to the replaced nodes
		untrack(clearHover);
	});

	// the theme decides where the highlighted text lands and how big it is:
	// the block's margin, border and padding, the line-number column, that
	// column's separator. Measuring the result beats copying numbers out of
	// the theme, so any theme keeps the caret on the glyphs
	$effect(() => {
		highlighted; // read to re-measure on every repaint, the nodes are replaced each time
		const scroller = mirror?.firstElementChild;
		const codeColumn = scroller?.lastElementChild;
		if (!codeColumn)
			return;
		// fractional values matter, rounding drifts the caret off the glyphs
		const measure = () => {
			const style = getComputedStyle(codeColumn);
			// relative to the editor, not the block, so the block's own margin
			// is part of the offset the textarea has to clear
			const editor = mirror.parentElement.getBoundingClientRect();
			const code = codeColumn.getBoundingClientRect();
			textX = code.left - editor.left + scroller.scrollLeft + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
			textY = code.top - editor.top + scroller.scrollTop + parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop);
			const blockStyle = getComputedStyle(mirror);
			codeSize = blockStyle.fontSize;
			codeLh = blockStyle.lineHeight;
			// the trailing edges are the block's own padding, not the text
			// origin, so scrolling to the end of a line stops where the theme
			// would stop
			codePad = blockStyle.paddingRight;
		};
		const observer = new ResizeObserver(measure);
		observer.observe(codeColumn);
		measure();
		return () => observer.disconnect();
	});

	// hovering a token underlines it and names its type in a tooltip; the
	// textarea overlay eats pointer events, so the span underneath is found
	// with elementsFromPoint
	let hovered = null;
	let showTimer;
	let lastHiddenAt = 0;

	function clearHover() {
		clearTimeout(showTimer);
		hovered?.classList.remove('tok-hover');
		hovered = null;
		if (tooltip) {
			lastHiddenAt = performance.now();
			tooltip = null;
		}
	}

	function onMouseMove(event) {
		// while a button is held the user is placing the caret or selecting,
		// the tooltip must never get in the way of editing
		if (event.buttons) {
			clearHover();
			return;
		}
		const span = document.elementsFromPoint(event.clientX, event.clientY)
			.find(element => element !== input && element.className.includes?.('shj-syn-'));
		if (span === hovered)
			return;

		const wasVisible = tooltip !== null;
		clearHover();
		if (!span)
			return;

		hovered = span;
		span.classList.add('tok-hover');
		const show = () => {
			const rect = span.getBoundingClientRect();
			tooltip = {
				text: span.className.match(/shj-syn-([\w-]+)/)[1],
				x: rect.left + rect.width / 2,
				y: rect.top - 5,
			};
		};
		// standard delay for the first tooltip, instant while moving between
		// tokens or shortly after one was shown
		if (wasVisible || performance.now() - lastHiddenAt < 1000)
			show();
		else
			showTimer = setTimeout(show, 500);
	}

	// the theme puts the scrolling on the wrapper the highlighter emits, not
	// on the block itself, so that is what follows the textarea
	function syncScroll() {
		const scroller = mirror?.firstElementChild;
		if (!scroller)
			return;
		scroller.scrollTop = input.scrollTop;
		scroller.scrollLeft = input.scrollLeft;
	}

	// tab indents (a multi-line selection indents or, with shift, dedents
	// whole lines); escape releases the next tab so keyboard users can leave
	let escaped = false;
	function onKeydown(event) {
		clearHover();
		if (event.key === 'Escape') {
			escaped = true;
			return;
		}
		if (event.key !== 'Tab' || escaped) {
			escaped = false;
			return;
		}
		event.preventDefault();
		const { selectionStart, selectionEnd, value } = input;
		const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;

		if (value.slice(selectionStart, selectionEnd).includes('\n') || event.shiftKey) {
			const block = value.slice(lineStart, selectionEnd);
			const replaced = event.shiftKey ? block.replace(/^\t/gm, '') : block.replace(/^/gm, '\t');
			if (replaced !== block) {
				input.setRangeText(replaced, lineStart, selectionEnd, 'preserve');
				input.setSelectionRange(lineStart, lineStart + replaced.length);
			}
		} else {
			input.setRangeText('\t', selectionStart, selectionEnd, 'end');
		}
		code = input.value;
	}
</script>

<div class="editor relative overflow-hidden bg-page" style="--caret: {caret ?? 'currentColor'}; --text-x: {textX}px; --text-y: {textY}px; --code-size: {codeSize}; --code-lh: {codeLh}; --code-pad: {codePad}">
	<div class="shj-lang-{lang} shj-block" bind:this={mirror} aria-hidden="true">{@html highlighted.html}</div>
	<textarea
		bind:this={input}
		bind:value={code}
		onscroll={() => { syncScroll(); clearHover(); }}
		onmousemove={onMouseMove}
		onmouseleave={clearHover}
		onmousedown={clearHover}
		onkeydown={onKeydown}
		spellcheck="false"
		autocapitalize="off"
		autocomplete="off"
		wrap="off"
		aria-label="Code editor, the code is highlighted live"
		class="absolute inset-0 m-0 size-full resize-none overflow-auto border-0 bg-transparent whitespace-pre text-transparent outline-none"
	></textarea>
</div>

{#if tooltip}
	<!-- the tooltip follows the code theme, not the page mode, so the
	     dark tokens are forced locally instead of hardcoding new colors -->
	<div
		class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md border border-line bg-page px-1.5 py-0.5 font-mono text-[11px] text-ink-strong {darkTooltip ? 'dark' : ''}"
		style="left: {tooltip.x}px; top: {tooltip.y}px"
	>
		{tooltip.text}
	</div>
{/if}
