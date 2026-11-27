import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { test } from 'node:test';
import { tokenize as tokenizeAsync } from '../src/index.js';
import * as grammars from '../src/languages/index.js';
import { tokenizeWith } from '../src/tokenize.js';

let { bash, css, html, js, jsdoc, json, md, py, regex, todo } = grammars,
	fixtures = new URL('../examples/languages/', import.meta.url),
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

test('a rule takes the whole token', () => {
	for (let [lang, src, token] of [
		['css', 'a{b:-moz-calc(1px)}', ['func', '-moz-calc']],
		['yaml', '_key: 1', ['var', '_key']],
		['lua', 'function M:in_1_bang()', ['func', 'in_1_bang']],
	])
		deepStrictEqual(collect(src, grammars[lang]).find(([, str]) => str === token[1]), token, `${lang}: ${src}`);
});

test('a long line takes linear time in every language', async () => {
	// a rule retried at every position of a long run took seconds, a minified
	// line or a base64 blob was enough
	let slow = [];
	for (let [name, lang] of Object.entries(grammars))
		for (let unit of ['a', '1', ' ']) {
			let start = performance.now();
			await collectAsync(unit.repeat(30000), lang);
			let ms = performance.now() - start;
			if (ms > 100)
				slow.push(`${name} ${JSON.stringify(unit)}: ${ms.toFixed(0)} ms`);
		}
	deepStrictEqual(slow, []);
});

test('numbers keep the sign of their exponent, in any case', () => {
	for (let lang of [json, js])
		deepStrictEqual(collect('1e+3 2E-3 0X1F', lang), [
			[undefined, ''],
			['num', '1e+3'],
			[undefined, ' '],
			['num', '2E-3'],
			[undefined, ' '],
			['num', '0X1F'],
			[undefined, '']
		]);
});


test('Bash single quotes have no escapes and can span lines', () => {
	deepStrictEqual(collect("'C:\\' x 'a\nb'", bash), [
		[undefined, ''],
		['str', "'C:\\'"],
		[undefined, ' x '],
		['str', "'a\nb'"],
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


test('Python f-strings keep doubled braces literal and nested braces in a field', () => {
	let merged = src => {
		let tokens = [];
		tokenizeWith(src, py, (str, token) => {
			let last = tokens.at(-1);
			if (!str) return;
			if (last?.[0] === token) last[1] += str;
			else tokens.push([token, str]);
		}, { languages: { py } });
		return tokens;
	};
	for (let [src, tokens] of [
		['f"{{user}} {name}"', [['str', 'f"{{user}} '], ['var', '{'], [undefined, 'name'], ['var', '}'], ['str', '"']]],
		['f"{{{name}}}"', [['str', 'f"{{'], ['var', '{'], [undefined, 'name'], ['var', '}'], ['str', '}}"']]],
		['f"{a}{{b}}{c}"', [['str', 'f"'], ['var', '{'], [undefined, 'a'], ['var', '}'], ['str', '{{b}}'], ['var', '{'], [undefined, 'c'], ['var', '}'], ['str', '"']]],
		['f"{{{{x}}}}"', [['str', 'f"{{{{x}}}}"']]],
		["f\"{d['k']}\"", [['str', 'f"'], ['var', '{'], [undefined, 'd['], ['str', "'k'"], [undefined, ']'], ['var', '}'], ['str', '"']]],
		['f"{b:{w}}"', [['str', 'f"'], ['var', '{'], [undefined, 'b:{w}'], ['var', '}'], ['str', '"']]],
		["f\"{ {'a':1}['a'] }\"", [['str', 'f"'], ['var', '{'], [undefined, ' {'], ['str', "'a'"], [undefined, ':'], ['num', '1'], [undefined, '}['], ['str', "'a'"], [undefined, '] '], ['var', '}'], ['str', '"']]],
		["f\"{f'{name}'}\"", [['str', 'f"'], ['var', '{'], ['str', "f'"], ['var', '{'], [undefined, 'name'], ['var', '}'], ['str', "'"], ['var', '}'], ['str', '"']]],
	])
		deepStrictEqual(merged(src), tokens, src);
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
