import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { highlightHTML, tokenize as tokenizeAsync } from '../src/index.js';
import { css, html, js, jsdoc, json, regex, todo } from '../src/languages/index.js';
import { tokenizeWith } from '../src/tokenize.js';

let fixtures = new URL('../examples/languages/', import.meta.url),
	languages = { css, html, js, jsdoc, json, regex, todo },
	read = file => readFileSync(new URL(file, fixtures), 'utf8'),
	collect = (src, lang, opt) => {
		let tokens = [];
		tokenizeWith(src, lang, (str, token) => tokens.push([token, str]), opt);
		return tokens;
	},
	collectAsync = async (src, lang) => {
		let tokens = [];
		await tokenizeAsync(src, lang, (str, token) => tokens.push([token, str]));
		return tokens;
	};

test('a definition given as a sub needs no registry', async () => {
	let src = read('test.json');

	deepStrictEqual(collect(src, { sub: json }), await collectAsync(src, 'json'));
});

test('a language can be given directly as its grammar', async () => {
	let src = read('test.json');

	deepStrictEqual(collect(src, json), await collectAsync(src, 'json'));
	deepStrictEqual(collect(src, json), collect(src, { sub: json }));
});

test('a nested sub is resolved from the given languages', async () => {
	let src = read('test.html');

	deepStrictEqual(collect(src, { sub: html }, { languages }), await collectAsync(src, 'html'));
});

test('a language can be given by name', async () => {
	let src = read('test.js');

	deepStrictEqual(collect(src, 'js', { languages }), await collectAsync(src, 'js'));
});

test('a language can be given as a definition or as its module', async () => {
	let src = read('test.json');

	deepStrictEqual(
		collect(src, 'json', { languages: { json } }),
		collect(src, 'json', { languages }));
});

test('the type of a language applies to the text it does not match', () => {
	deepStrictEqual(collect('// TODO stuff', { sub: js }, { languages }), [
		[undefined, ''],
		['cmnt', '// '],
		['err', 'TODO'],
		['cmnt', ' stuff'],
		[undefined, '']
	]);
});

test('a sub that is not given keeps the type of its rule', () => {
	deepStrictEqual(collect('"test"\n// TODO stuff', { sub: js }), [
		[undefined, ''],
		["str", '"test"'],
		[undefined, '\n'],
		['cmnt', '// TODO stuff'],
		[undefined, '']
	]);
});

test('a language that is not given is emitted as plain text', () => {
	deepStrictEqual(collect('{}', 'json'), [[undefined, '{}']]);
});

test('a trailing newline does not add a line number', async () => {
	let html = await highlightHTML('let answer = 42;\n', 'js', { showLineNumbers: true });

	deepStrictEqual(html.match(/<div><\/div>/g)?.length, 1);
});


test('wrapped numbered lines keep each logical line with its own gutter cell', async () => {
	let grammar = [{ match: /alpha\nbeta/g, type: 'kwd' }];
	deepStrictEqual(await highlightHTML('alpha\nbeta\n', grammar, { wrap: true, showLineNumbers: true }),
		'<div class="shj-wrap"><div class="shj-numbers"><div></div></div><div><span class="shj-syn-kwd">alpha</span></div><div class="shj-numbers"><div></div></div><div><span class="shj-syn-kwd">beta</span></div></div>');
});


test('wrapped line numbers include blank lines and escape token text', async () => {
	deepStrictEqual(await highlightHTML('<a>\n\n<b>', 'plain', { wrap: true, showLineNumbers: true }),
		'<div class="shj-wrap"><div class="shj-numbers"><div></div></div><div>&lt;a&gt;</div><div class="shj-numbers"><div></div></div><div></div><div class="shj-numbers"><div></div></div><div>&lt;b&gt;</div></div>');
});


test('wrapped blocks without numbers and inline output retain their highlighting', async () => {
	let grammar = [{ match: /alpha/g, type: 'kwd' }];
	deepStrictEqual(await highlightHTML('alpha\nbeta', grammar, { wrap: true }),
		'<div class="shj-wrap"><div class="shj-numbers"></div><div><span class="shj-syn-kwd">alpha</span>\nbeta</div></div>');
	deepStrictEqual(await highlightHTML('alpha', grammar, { wrap: true, block: false, showLineNumbers: true }),
		'<span class="shj-syn-kwd">alpha</span>');
});
