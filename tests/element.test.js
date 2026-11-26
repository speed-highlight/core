import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { highlightAll, highlightElement, highlightHTML } from '../src/index.js';

// just what highlightElement reads and writes, no DOM needed
let element = (tagName, className, parent) => ({
	tagName, className, parentElement: { tagName: parent },
	textContent: 'let a', dataset: {}, innerHTML: '',
	get classList() { return this.className.split(' ').filter(Boolean); }
});

test('an element marked with a standard language-* class is highlighted', async () => {
	for (let [tag, parent, className, result] of [
		['CODE', 'PRE', 'language-javascript', ['language-javascript shj-lang-javascript shj-block', await highlightHTML('let a', 'js')]],
		['CODE', 'P', 'x language-js', ['x language-js shj-lang-js shj-inline', await highlightHTML('let a', 'js', { block: false })]],
		['CODE', 'PRE', 'language-mermaid', ['language-mermaid', '']],
		['DIV', 'BODY', 'shj-lang-nope', [' shj-lang-nope shj-block', await highlightHTML('let a', 'plain')]],
		['CODE', 'PRE', 'language-js shj-lang-ts', ['language-js shj-lang-ts shj-block', await highlightHTML('let a', 'ts')]],
	]) {
		let elm = element(tag, className, parent);
		await highlightElement(/** @type {any} */ (elm));
		deepStrictEqual([elm.className, elm.innerHTML], result, `${parent} > ${tag}.${className}`);
	}
});

test('highlightAll takes language-* only from code elements', async () => {
	let selectors = [];
	// @ts-ignore a minimal dom
	globalThis.document = { querySelectorAll: selector => (selectors.push(selector), []) };
	await highlightAll();
	deepStrictEqual(selectors, ['[class*="shj-lang-"],code[class*="language-"]']);
});
