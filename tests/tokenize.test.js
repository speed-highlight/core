import { deepStrictEqual, rejects, throws } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { highlightHTML, tokenize as tokenizeAsync } from '../src/index.js';
import { css, html, js, jsdoc, json, regex, todo } from '../src/languages/index.js';
import { detectLanguage } from '../src/detect.js';
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

test('hostile token types cannot add attributes or classes to highlighted HTML', async () => {
	let hostile = { match: /x/g, type: 'kwd" onclick="alert(1)' };
	deepStrictEqual(await highlightHTML('<x>', [hostile], { block: false }), '&lt;x&gt;');
	deepStrictEqual(await highlightHTML('x', [{ match: /x/g, type: 'kwd injected' }], { block: false }), 'x');
});


test('token callback failures propagate without emitting the remaining source', async () => {
	let error = new Error('callback failed'), tokens = [],
		callback = (str) => {
			tokens.push(str);
			if (str === 'X') throw error;
		},
		grammar = [{ match: /X/g, type: 'kwd' }];

	throws(() => tokenizeWith('aXb', grammar, callback), err => err === error);
	deepStrictEqual(tokens, ['a', 'X']);
	await rejects(tokenizeAsync('aXb', grammar, callback), err => err === error);
	deepStrictEqual(tokens, ['a', 'X', 'a', 'X']);
});


test('nested token callback failures do not retry the enclosing match', () => {
	let error = new Error('nested callback failed'), tokens = [];
	throws(() => tokenizeWith('aXb', [{ match: /X/g, sub: [{ match: /X/g, type: 'kwd' }] }], str => {
		tokens.push(str);
		if (str === 'X') throw error;
	}), err => err === error);
	deepStrictEqual(tokens, ['a', '', 'X']);
});


test('a failed matcher still emits the unprocessed source once', () => {
	let tokens = [];
	tokenizeWith('aXb', [
		{ match: /X/g, type: 'kwd' },
		{ match: { lastIndex: 0, exec() { throw new Error('matcher failed'); } } }
	], str => tokens.push(str));
	deepStrictEqual(tokens, ['aXb']);
});


test('a failing sub does not duplicate consumed text', () => {
	deepStrictEqual(collect('aXb', [{ match: /X/g, type: 'str', sub() { throw new Error('sub failed'); } }]), [
		[undefined, 'a'], [undefined, 'Xb']
	]);
});


test('JavaScript is detected from common JS statements', () => {
	deepStrictEqual(detectLanguage('const x = 1;\nconsole.log(x)'), 'js');
});


test('TypeScript-specific syntax remains detected as TypeScript', () => {
	deepStrictEqual(detectLanguage('interface User { name: string }\nconst user: User = { name: "Ada" };'), 'ts');
});


test('a plain type identifier is not enough to detect TypeScript', () => {
	for (const code of ['type', 'type()', '{"type": "home"}', 'The type of a value'])
		deepStrictEqual(detectLanguage(code), 'plain', code);
	deepStrictEqual(detectLanguage('<input type="text">'), 'plain');
});


test('existing language fixtures retain their expected detection', () => {
	const expected = { asm: 'asm', bash: 'bash', bf: 'diff', c: 'c', css: 'css', csv: 'plain', diff: 'diff', docker: 'docker', git: 'diff', go: 'go', html: 'html', http: 'http', ini: 'plain', java: 'java', js: 'js', jsdoc: 'plain', json: 'plain', 'leanpub-md': 'js', log: 'md', lua: 'lua', make: 'make', md: 'js', pl: 'pl', plain: 'py', py: 'py', regex: 'plain', rs: 'rs', sql: 'sql', todo: 'plain', toml: 'md', ts: 'ts', uri: 'uri', xml: 'xml', yaml: 'diff' };
	const files = readdirSync(fixtures).filter(file => file.startsWith('test.'));
	deepStrictEqual(files.map(file => file.slice(5)).sort(), Object.keys(expected).sort());
	for (const file of files)
		deepStrictEqual(detectLanguage(read(file)), expected[file.slice(5)], file);
});
