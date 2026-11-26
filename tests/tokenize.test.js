import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { tokenize as tokenizeAsync } from '../src/index.js';
import * as grammars from '../src/languages/index.js';
import { tokenizeWith } from '../src/tokenize.js';

let { css, html, js, jsdoc, json, regex, todo } = grammars,
	fixtures = new URL('../examples/languages/', import.meta.url),
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

test('a rule takes the whole token', () => {
	for (let [lang, src, token] of [
		['css', 'a{b:-moz-calc(1px)}', ['func', '-moz-calc']],
		['yaml', '_key: 1', ['var', '_key']],
		['lua', 'function M:in_1_bang()', ['func', 'in_1_bang']],
		['regex', '/[[]a]/', ['num', '[[]']],
	])
		deepStrictEqual(collect(src, grammars[lang]).find(([, str]) => str === token[1]), token, `${lang}: ${src}`);
});

test('a css value before a nested block stays a value', () => {
	let tokens = collect('.a { b: repeat(2, c); &:hover { d: e } }', css);
	deepStrictEqual([['func', 'repeat'], ['num', 'c']].filter(token => tokens.some(([type, str]) => type === token[0] && str === token[1])).length, 2);
});

test('a css comment stays whole, even holding a rule', () => {
	deepStrictEqual(collect('a {}\n/* .old { b: c } */\n.d {}', css).filter(([type]) => type === 'cmnt').map(([, str]) => str).join(''), '/* .old { b: c } */');
});

test('a long line takes linear time in every language', async () => {
	// a rule retried at every position of a long run took seconds, a minified
	// line or a base64 blob was enough
	let slow = [];
	for (let [name, lang] of Object.entries(grammars))
		for (let unit of ['a', '1', ' ', '[', '<', '*', '&', '.a', 'a-']) {
			let start = performance.now();
			await collectAsync(unit.repeat(30000), lang);
			let ms = performance.now() - start;
			if (ms > 100)
				slow.push(`${name} ${JSON.stringify(unit)}: ${ms.toFixed(0)} ms`);
		}
	deepStrictEqual(slow, []);
});
