import { deepStrictEqual } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { test } from 'node:test';
import { tokenize as tokenizeAsync } from '../src/index.js';
import { css, html, js, jsdoc, json, mongodb, regex, todo } from '../src/languages/index.js';
import { detectLanguage } from '../src/detect.js';
import { tokenizeWith } from '../src/tokenize.js';

let fixtures = new URL('../examples/languages/', import.meta.url),
	languages = { css, html, js, jsdoc, json, mongodb, regex, todo },
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

test('new bundled language grammars are exported', async () => {
	let languages = await import('../src/languages/index.js');

	for (let name of ['cobol', 'cpp', 'cs', 'gd', 'mongodb', 'php', 'ps1', 'rb', 'vim', 'wat'])
		deepStrictEqual(typeof languages[name], 'object', `${name} grammar should be exported`);
});


test('new language signatures are detected', () => {
	deepStrictEqual(detectLanguage('IDENTIFICATION DIVISION.\nPROCEDURE DIVISION.'), 'cobol');
	deepStrictEqual(detectLanguage('#include <iostream>\nstd::cout << "hello";'), 'cpp');
	deepStrictEqual(detectLanguage('using System;\nConsole.WriteLine("hello");'), 'cs');
	deepStrictEqual(detectLanguage('<?php\necho "hello";'), 'php');
	deepStrictEqual(detectLanguage('require_relative "user"\nattr_reader :name'), 'rb');
	deepStrictEqual(detectLanguage('nnoremap <leader>w :write<CR>\naugroup custom'), 'vim');
	deepStrictEqual(detectLanguage('Write-Host "hello"\nGet-Process'), 'ps1');
});


test('MongoDB quoted keys preserve escaped quotes and finish promptly without a closing quote', () => {
	deepStrictEqual(collect('\"a\\\"b\": 1', mongodb).slice(0, 2), [
		[undefined, ''], [undefined, '\"a\\\"b\"']
	]);
	const duration = length => {
		let start = performance.now();
		tokenizeWith('\"' + 'a'.repeat(length), mongodb, () => {});
		return performance.now() - start;
	};
	let short = duration(6000), long = duration(24000);
	// Quadrupling the input must not take sixteen times as long.
	deepStrictEqual(long < short * 8 + 30, true, `MongoDB unterminated key: ${short}ms vs ${long}ms`);
});


test('new language function rules scan long identifiers without retrying suffixes', async () => {
	let { cpp, cs, gd, php, rb } = await import('../src/languages/index.js');
	for (let [name, grammar, prefix] of [
		['cpp', cpp, ''], ['cs', cs, ''], ['gd', gd, ''],
		['php', php, '<?php '], ['rb', rb, '']
	]) {
		let duration = length => {
			let start = performance.now();
			tokenizeWith(prefix + 'a'.repeat(length), grammar, () => {});
			return performance.now() - start;
		};
		let short = duration(4000), long = duration(16000);
		deepStrictEqual(long < short * 8 + 30, true, `${name} identifier: ${short}ms vs ${long}ms`);
		deepStrictEqual(collect(prefix + 'call (1)', grammar).some(([type, text]) => type === 'func' && text === 'call'), true, `${name} call`);
		deepStrictEqual(collect(prefix + '0call (1)', grammar).some(([type]) => type === 'func'), false, `${name} identifier suffix`);
	}
});


test('PHP and Ruby heredocs scan repeated unterminated openers promptly', async () => {
	let { php, rb } = await import('../src/languages/index.js');
	for (let [name, grammar, prefix, opener] of [
		['php', php, '<?php\n', '<<<TAG\nbody\n'],
		['rb', rb, '', '<<TAG\nbody\n']
	]) {
		let duration = count => {
			let start = performance.now();
			tokenizeWith(prefix + opener.repeat(count), grammar, () => {});
			return performance.now() - start;
		};
		let short = duration(1000), long = duration(4000);
		deepStrictEqual(long < short * 8 + 40, true, `${name} heredoc: ${short}ms vs ${long}ms`);
		let src = prefix + opener + 'TAG\n';
		deepStrictEqual(collect(src, grammar).some(([type, text]) => type === 'str' && text.includes(opener) && text.endsWith('TAG')), true, `${name} terminator`);
	}
});


test('PowerShell here-strings close only at the start of a line', async () => {
	let { ps1 } = await import('../src/languages/index.js');
	let src = '@"\nfirst "@ inline\nsecond\n"@';
	deepStrictEqual(collect(src, ps1).some(([type, text]) => type === 'str' && text === src), true);
});


test('a later heredoc still closes when an earlier opener is unterminated', async () => {
	let { php, rb } = await import('../src/languages/index.js');
	for (let [grammar, src] of [
		[php, '<?php\n<<<MISSING\n<<<FOUND\nvalue\nFOUND\n'],
		[rb, '<<MISSING\n<<FOUND\nvalue\nFOUND\n']
	])
		deepStrictEqual(collect(src, grammar).some(([type, text]) => type === 'str' && (text.startsWith('<<<FOUND') || text.startsWith('<<FOUND'))), true);
});


test('heredoc grammars can tokenize the same source twice', async () => {
	let { php, rb } = await import('../src/languages/index.js');
	for (let [grammar, src] of [
		[php, '<?php\n<<<A\ntext\nA\n<<<B\ntext\nB'],
		[rb, '<<A\ntext\nA\n<<B\ntext\nB']
	]) {
		let first = collect(src, grammar);
		deepStrictEqual(first.filter(([type]) => type === 'str').map(([, text]) => text),
			grammar === php ? ['<<<A\ntext\nA', '<<<B\ntext\nB'] : ['<<A\ntext\nA', '<<B\ntext\nB']);
		deepStrictEqual(collect(src, grammar), first);
	}
});


test('Ruby heredoc terminators require full labels and plain openers require column zero', async () => {
	let { rb } = await import('../src/languages/index.js');
	for (let [opener, indentation] of [['<<TAG', ''], ['<<-TAG', '  '], ['<<~TAG', '  ']]) {
		let src = `s = ${opener}\nhello\n${indentation}TAGsuffix\nworld\n${indentation}TAG\n`;
		deepStrictEqual(collect(src, rb).filter(([type]) => type === 'str').map(([, text]) => text),
			[`${opener}\nhello\n${indentation}TAGsuffix\nworld\n${indentation}TAG`]);
	}
	let punctuation = 's = <<TAG\nhello\nTAG;\nworld\nTAG\n';
	deepStrictEqual(collect(punctuation, rb).filter(([type]) => type === 'str').map(([, text]) => text),
		['<<TAG\nhello\nTAG;\nworld\nTAG']);
	let src = 's = <<TAG\nhello\n  TAG\nworld\nTAG\n';
	deepStrictEqual(collect(src, rb).filter(([type]) => type === 'str').map(([, text]) => text),
		['<<TAG\nhello\n  TAG\nworld\nTAG']);
});


test('new language fixtures retain their expected detection', () => {
	const expected = {
		cobol: 'cobol', cpp: 'cpp', cs: 'cs', gd: 'go', mongodb: 'pl',
		php: 'php', ps1: 'ps1', rb: 'rb', vim: 'vim', wat: 'go'
	};
	const files = readdirSync(fixtures).filter(file => file.startsWith('test.') && file.slice(5) in expected);
	deepStrictEqual(files.map(file => file.slice(5)).sort(), Object.keys(expected).sort());
	for (const file of files)
		deepStrictEqual(detectLanguage(read(file)), expected[file.slice(5)], file);
});
