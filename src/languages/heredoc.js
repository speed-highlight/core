/**
 * Index line-start labels once, instead of searching the remainder of the
 * source again for every unterminated heredoc opener.
 *
 * @param {RegExp} opener
 * @param {boolean} prefix Whether a terminator may continue after the label
 * @returns {import('../tokenize.js').ShjMatcher}
 */
export function heredoc(opener, prefix) {
	let lastIndex = 0, source, labels, cursors, scannedThrough = 0, lastStart = 0;

	function index(src) {
		labels = { children: new Map(), matches: [] };
		cursors = new Map();
		scannedThrough = 0;
		// A terminator starts on its own line after optional indentation.
		let line = prefix
			? /^([\t ]*)([A-Za-z_]\w*)(?=\r?$)/gm
			: /\n\s*([A-Za-z0-9_]\w*)/g, match;
		while ((match = line.exec(src))) {
			let label = match[prefix ? 2 : 1], start = match.index, end = line.lastIndex;
			let node = labels;
			for (let i = 0; i < label.length; i++) {
				let char = label[i];
				if (!node.children.has(char)) node.children.set(char, { children: new Map(), matches: [] });
				node = node.children.get(char);
				if (i === label.length - 1)
					node.matches.push({ start, end: end - label.length + i + 1, indented: prefix && !!match[1] });
			}
		}
	}

	return {
		get lastIndex() { return lastIndex; },
		set lastIndex(value) { lastIndex = value; },
		exec(src) {
			if (source !== src) {
				source = src;
				index(src);
			}
			if (lastIndex < scannedThrough) cursors.clear();
			scannedThrough = lastIndex;
			opener.lastIndex = lastIndex;
			let match;
			while ((match = opener.exec(src))) {
				let start = match.index, label = match[2], node = labels;
				if (start < lastStart) cursors.clear();
				lastStart = start;
				for (let char of label) {
					node = node.children.get(char);
					if (!node) break;
				}
				if (!node?.matches.length) continue;
				let candidates = node.matches, allowsIndent = /<<[-~]/.test(match[0]),
				next = cursors.get(label + allowsIndent) ?? 0;
				while (next < candidates.length && (candidates[next].start < opener.lastIndex || prefix && !allowsIndent && candidates[next].indented))
					next++;
				cursors.set(label + allowsIndent, next);
				if (next === candidates.length) continue;
				let end = candidates[next].end;
				lastIndex = end;
				scannedThrough = end;
				return { index: start, 0: src.slice(start, end) };
			}
			return null;
		}
	};
}
