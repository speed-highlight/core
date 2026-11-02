import { test } from 'node:test';
import { strictEqual } from 'node:assert';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tokenize } from '../src/index.js';

let fixtures = new URL('../examples/languages/', import.meta.url),
	snapshots = new URL('./snapshots/', import.meta.url);

for (let file of readdirSync(fixtures).filter(file => /^(test|oneline)\./.test(file)))
	test(file, async () => {
		let src = readFileSync(new URL(file, fixtures), 'utf8'),
			snapshot = new URL(`${file}.txt`, snapshots),
			tokens = [];

		await tokenize(src, file.slice(file.indexOf('.') + 1), (str, token) => tokens.push([token, str]));

		// checked before UPDATE so a refreshed snapshot can never bless dropped code
		strictEqual(tokens.map(([, str]) => str).join(''), src);

		let got = tokens.filter(([, str]) => str).map(([token, str]) => `${token ?? '.'}\t${JSON.stringify(str)}`).join('\n');

		if (process.env.UPDATE)
			writeFileSync(snapshot, got);
		else
			strictEqual(got, readFileSync(snapshot, 'utf8'));
	});
