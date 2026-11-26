import { deepStrictEqual, throws } from 'node:assert';
import { test } from 'node:test';
import { collectAliases } from '../scripts/generate-aliases.js';
import { highlightHTML } from '../src/index.js';

test('an alias taken twice, or naming another language, fails the build', () => {
	throws(() => collectAliases([['js', 'javascript'], ['ts', 'javascript']]), /"javascript"/);
	throws(() => collectAliases([['js', 'ts'], ['ts', '']]), /"ts"/);
});

test('a language can be given by an alias', async () => {
	deepStrictEqual(await highlightHTML('let a = 1', 'javascript'), await highlightHTML('let a = 1', 'js'));
});
