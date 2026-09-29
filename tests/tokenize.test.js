import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { tokenize as tokenizeAsync } from '../src/index.js';
import { css, diff, git, html, js, jsdoc, json, regex, todo } from '../src/languages/index.js';
import { tokenizeWith } from '../src/tokenize.js';

let fixtures = new URL('../examples/languages/', import.meta.url),
	languages = { css, diff, git, html, js, jsdoc, json, regex, todo },
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

test('diff file headers take precedence over inserted and deleted lines', () => {
	deepStrictEqual(collect('--- a/document.txt\n+++ b/document.txt', diff), [
		[undefined, ''],
		['section', '--- a/document.txt'],
		[undefined, '\n'],
		['section', '+++ b/document.txt'],
		[undefined, '']
	]);
});


test('diff metadata and git prose do not highlight unanchored punctuation', () => {
	deepStrictEqual(collect('notice! It should\n! metadata', diff), [
		[undefined, 'notice! It should\n'],
		['kwd', '! metadata'],
		[undefined, '']
	]);
	deepStrictEqual(collect("fix: don't expand the quote\n\"unclosed", git), [
		[undefined, "fix: don't expand the quote\n"],
		['str', '"unclosed'],
		[undefined, '']
	]);
});


test('diff file headers accept spaced paths and tab-separated timestamps', () => {
	deepStrictEqual(collect('--- a/dir/mon fichier.txt\n+++ b/dir/mon fichier.txt\n--- ancien fichier.txt\t2026-09-29 12:00:00\n+++ nouveau fichier.txt\t2026-09-29 12:00:00', diff), [
		[undefined, ''],
		['section', '--- a/dir/mon fichier.txt'],
		[undefined, '\n'],
		['section', '+++ b/dir/mon fichier.txt'],
		[undefined, '\n'],
		['section', '--- ancien fichier.txt\t2026-09-29 12:00:00'],
		[undefined, '\n'],
		['section', '+++ nouveau fichier.txt\t2026-09-29 12:00:00'],
		[undefined, '']
	]);
});


test('bare diff markers remain content lines', () => {
	deepStrictEqual(collect('---\n+++', diff), [
		[undefined, ''],
		['deleted', '---'],
		[undefined, '\n'],
		['insert', '+++'],
		[undefined, '']
	]);
});
