import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { test } from 'node:test';
import { tokenize as tokenizeAsync } from '../src/index.js';
import { bash, css, html, js, jsdoc, json, md, py, regex, todo } from '../src/languages/index.js';
import { tokenizeWith } from '../src/tokenize.js';

let fixtures = new URL('../examples/languages/', import.meta.url),
	languages = { bash, css, html, js, jsdoc, json, md, py, regex, todo },
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

test('JSON numbers retain exponent signs and negative prefixes', () => {
	deepStrictEqual(collect('1e+3 -1', json), [
		[undefined, ''],
		['num', '1e+3'],
		[undefined, ' '],
		['num', '-1'],
		[undefined, '']
	]);
});


test('Bash variables remain literal in single-quoted strings', () => {
	deepStrictEqual(collect("'$HOME' \"$HOME\"", bash), [
		[undefined, ''],
		['str', "'$HOME'"],
		[undefined, ' '],
		['str', '"'],
		['var', '$HOME'],
		['str', '"'],
		[undefined, '']
	]);
});


test('Markdown fenced JavaScript blocks retain bare and attributed language labels', () => {
	for (let [fence, label] of [ [ '```', 'js' ], [ '```', 'js title=foo' ], [ '````', 'js title=foo' ] ]) {
		deepStrictEqual(collect(`${fence}${label}\nconst x = 1;\n${fence}`, md, { languages: { js } }), [
			[undefined, ''],
			['kwd', `${fence}${label}`],
			[undefined, '\n'],
			['kwd', 'const'],
			[undefined, ' x '],
			['oper', '='],
			[undefined, ' '],
			['num', '1'],
			[undefined, ';\n'],
			['kwd', fence],
			[undefined, '']
		]);
	}
});


test('Python f-strings leave doubled braces as literals', () => {
	deepStrictEqual(collect('f"{{user}} {name}"', py), [
		[undefined, ''],
		['str', 'f"{{user}} '],
		['var', '{'],
		[undefined, 'name'],
		['var', '}'],
		['str', '"'],
		[undefined, '']
	]);
});


test('Python f-strings retain interpolations after escaped braces', () => {
	deepStrictEqual(collect('f"{{{name}}}"', py), [
		[undefined, ''],
		['str', 'f"{{'],
		['var', '{'],
		[undefined, 'name'],
		['var', '}'],
		['str', '}}"'],
		[undefined, '']
	]);
	deepStrictEqual(collect('f"{a}{{b}}{c}"', py), [
		[undefined, ''],
		['str', 'f"'],
		['var', '{'],
		[undefined, 'a'],
		['var', '}'],
		['str', '{{b}}'],
		['var', '{'],
		[undefined, 'c'],
		['var', '}'],
		['str', '"'],
		[undefined, '']
	]);
});


test('Python f-strings leave fully escaped braces as literals', () => {
	deepStrictEqual(collect('f"{{{{x}}}}"', py), [
		[undefined, ''],
		['str', 'f"{{{{x}}}}"'],
		[undefined, '']
	]);
});


test('Python f-string fields skip quoted braces and retain nested braces', () => {
	for (let [src, expected] of [
		['f"{d[\'k\']}"', [
			['str', 'f"'], ['var', '{'], [undefined, 'd['], ['str', "'k'"],
			[undefined, ']'], ['var', '}'], ['str', '"']
		]],
		['f"{\'}\'}"', [
			['str', 'f"'], ['var', '{'], ['str', "'}'"], ['var', '}'], ['str', '"']
		]],
		['f"{\'{\'}"', [
			['str', 'f"'], ['var', '{'], ['str', "'{'"], ['var', '}'], ['str', '"']
		]],
		['f"{ {\'a\':1}[\'a\'] }"', [
			['str', 'f"'], ['var', '{'], [undefined, ' {'], ['str', "'a'"],
			[undefined, ':'], ['num', '1'], [undefined, '}['], ['str', "'a'"],
			[undefined, '] '], ['var', '}'], ['str', '"']
		]],
		['f"{f\'{name}\'}"', [
			['str', 'f"'], ['var', '{'], ['str', "f'"], ['var', '{'],
			[undefined, 'name'], ['var', '}'], ['str', "'"], ['var', '}'], ['str', '"']
		]],
		['f"{\'\'\'}\'\'\'}"', [
			['str', 'f"'], ['var', '{'], ['cmnt', "'''}'''"], ['var', '}'], ['str', '"']
		]],
		['f"{\'\\\'}\'}"', [
			['str', 'f"'], ['var', '{'], ['str', "'\\'}'"], ['var', '}'], ['str', '"']
		]]
	]) {
		let tokens = collect(src, py, { languages: { py } });
		deepStrictEqual(tokens.filter(([, text]) => text), expected, src);
		deepStrictEqual(tokens.map(([, text]) => text).join(''), src);
	}
});


test('Python f-string brace scanning scales linearly on unmatched opening braces', () => {
	for (let prefix of [ '', '{a' ]) {
		let duration = count => {
			let start = performance.now();
			tokenizeWith('f"' + prefix + '{'.repeat(count) + '"', py, () => {});
			return performance.now() - start;
		};
		let short = duration(8000), long = duration(32000);
		deepStrictEqual(long < short * 8 + 80, true, `f-string braces: ${short}ms vs ${long}ms`);
	}
});
