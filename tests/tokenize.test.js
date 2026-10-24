import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { highlightHTML, tokenize as tokenizeAsync } from '../src/index.js';
import { css, html, js, jsdoc, json, regex, todo } from '../src/languages/index.js';
import { highlightHTMLSync, tokenizeWith } from '../src/tokenize.js';

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

test('html takes the attribute names framework templates write', () => {
	for (let attribute of ['[code]', '(click)', '@click', ':code', '{code}', '#slot', '*ngIf'])
		deepStrictEqual(
			collect(`<a ${attribute}>`, html, { languages }).filter(([type, str]) => type && str),
			[['oper', '<'], ['var', 'a'], ['class', attribute], ['oper', '>']],
			attribute);
});

test('synchronous HTML highlighting matches the loader-based output', async () => {
	let grammar = [{ match: /alpha\nbeta/g, type: 'kwd' }],
		src = 'alpha\nbeta\n';

	for (let opt of [{ block: false }, { showLineNumbers: true }])
		deepStrictEqual(highlightHTMLSync(src, grammar, opt), await highlightHTML(src, grammar, opt));
});


test('synchronous HTML highlighting uses supplied sub-languages', async () => {
	let src = '<style>p { color: #fff }</style>',
		opt = { block: false, languages: { css } };

	deepStrictEqual(highlightHTMLSync(src, html, opt), await highlightHTML(src, 'html', { block: false }));
});


test('synchronous and loader-based rendering escape text and reject unsafe token classes', async () => {
	let grammar = [{ match: /<x>/g, type: 'kwd injected' }],
		src = '<x>\n&';
	for (let opt of [{ block: false }, { showLineNumbers: true }]) {
		deepStrictEqual(highlightHTMLSync(src, grammar, opt), await highlightHTML(src, grammar, opt));
		deepStrictEqual(highlightHTMLSync(src, grammar, opt).includes('shj-syn-'), false);
	}
});
