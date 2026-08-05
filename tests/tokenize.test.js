import { test } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { tokenize as tokenizeAsync } from '../src/index.js';
import { tokenize } from '../src/tokenize.js';
import * as css from '../src/languages/css.js';
import * as html from '../src/languages/html.js';
import * as js from '../src/languages/js.js';
import * as js_template_literals from '../src/languages/js_template_literals.js';
import * as jsdoc from '../src/languages/jsdoc.js';
import * as json from '../src/languages/json.js';
import * as regex from '../src/languages/regex.js';
import * as todo from '../src/languages/todo.js';

let fixtures = new URL('../examples/languages/', import.meta.url),
	languages = { css, html, js, js_template_literals, jsdoc, json, regex, todo },
	read = file => readFileSync(new URL(file, fixtures), 'utf8'),
	collect = (src, lang, opt) => {
		let tokens = [];
		tokenize(src, lang, (str, token) => tokens.push([token, str]), opt);
		return tokens;
	},
	collectAsync = async (src, lang) => {
		let tokens = [];
		await tokenizeAsync(src, lang, (str, token) => tokens.push([token, str]));
		return tokens;
	};

test('a definition given as a sub needs no registry', async () => {
	let src = read('test.json');

	deepStrictEqual(collect(src, { sub: json.default }), await collectAsync(src, 'json'));
});

test('a nested sub is resolved from the given languages', async () => {
	let src = read('test.html');

	deepStrictEqual(collect(src, { sub: html.default }, { languages }), await collectAsync(src, 'html'));
});

test('a language can be given by name', async () => {
	let src = read('test.js');

	deepStrictEqual(collect(src, 'js', { languages }), await collectAsync(src, 'js'));
});

test('a language can be given as a definition or as its module', async () => {
	let src = read('test.json');

	deepStrictEqual(
		collect(src, 'json', { languages: { json: json.default } }),
		collect(src, 'json', { languages }));
});

test('the type of a language applies to the text it does not match', () => {
	deepStrictEqual(collect('// TODO stuff', { sub: js.default }, { languages }), [
		[undefined, ''],
		['cmnt', '// '],
		['err', 'TODO'],
		['cmnt', ' stuff'],
		[undefined, '']
	]);
});

test('a sub that is not given is emitted as plain text', () => {
	deepStrictEqual(collect('// TODO stuff', { sub: js.default }), [
		[undefined, ''],
		[undefined, '// TODO stuff'],
		[undefined, '']
	]);
});

test('a language that is not given is emitted as plain text', () => {
	deepStrictEqual(collect('{}', 'json'), [[undefined, '{}']]);
});
