/**
 * The documentation is tested like code:
 *
 * - package import paths and cdn urls in README code blocks must resolve
 *   (the runner below rewrites specifiers to dist/, so only these checks
 *   cover the exports map and the stripped css imports)
 * - relative links and anchors in the README must point at real files
 *   and real headings
 * - every js code block in the README and every JSDoc `@example` in src/
 *   is executed as a real module, then type checked by tsc against the
 *   d.ts of dist
 *
 * Snippets are fragments, so a small prelude provides the context they
 * assume, but only names a snippet does not import or declare itself.
 * Snippets importing from urls (cdn, deno.land) and jsx are skipped.
 */

import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tmp = path.join(root, 'tests', '.tmp-snippets');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const pkg = JSON.parse(read('package.json'));
const readme = read('README.md');
const codeBlocks = [...readme.matchAll(/^```([a-z]*)\n([\s\S]*?)^```/gm)]
	.map(([, language, body]) => ({ language, body }));

// ---- import paths and links

test('package import paths in code blocks resolve against the exports map', () => {
	const isExported = subpath => Object.keys(pkg.exports).some(key => {
		const [prefix, suffix] = key.includes('*') ? key.split('*') : [key, ''];
		return key === subpath || (key.includes('*') && subpath.startsWith(prefix) && subpath.endsWith(suffix));
	});

	const specifiers = codeBlocks
		.flatMap(({ body }) => [...body.matchAll(/(?:from\s+|import\s*\(\s*|require\s*\(\s*|^\s*import\s+)['"]([^'"]+)['"]/gm)])
		.map(match => match[1].replace(/^npm:/, ''))
		.filter(spec => spec === pkg.name || spec.startsWith(`${pkg.name}/`));
	assert.ok(specifiers.length > 0, 'expected the README to contain package imports');

	for (const spec of specifiers)
		assert.ok(isExported(spec === pkg.name ? '.' : `.${spec.slice(pkg.name.length)}`),
			`"${spec}" is not exported by package.json (would fail with ERR_PACKAGE_PATH_NOT_EXPORTED)`);
});

test('cdn urls in the README point at files that exist in the repo', () => {
	for (const [, file] of readme.matchAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/@[^/]+\/[^/@]+(?:@[^/]+)?\/([^'")\s]+)/g))
		assert.ok(fs.existsSync(path.join(root, file)), `README links a CDN file missing from the repo: ${file}`);
});

test('relative links and anchors in the README resolve', () => {
	// the same slug rules generate-toc.js uses, so anchors match headings
	const slugCounts = {};
	const anchors = new Set();
	for (const [, heading] of readme.replace(/^```.*?^```/gms, '').matchAll(/^#{1,3} (.+?)\s*$/gm)) {
		const base = heading.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().replace(/ /g, '-');
		anchors.add(slugCounts[base] ? `${base}-${slugCounts[base]}` : base);
		slugCounts[base] = (slugCounts[base] ?? 0) + 1;
	}

	for (const [, target] of readme.matchAll(/\]\(([^)\s]+)\)/g)) {
		if (target.startsWith('#'))
			assert.ok(anchors.has(target.slice(1)), `README links a heading that does not exist: ${target}`);
		else if (!target.startsWith('http'))
			assert.ok(fs.existsSync(path.join(root, target.split('#')[0])), `README links a file that does not exist: ${target}`);
	}
});

// ---- run and type check every snippet

const snippets = codeBlocks.flatMap(({ language, body }) => {
	if (language === 'js')
		return [{ name: 'README js block', body }];
	if (language === 'html')
		return [...body.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
			.map(script => ({ name: 'README html block script', body: script[1] }));
	return [];
});

for (const file of fs.readdirSync(path.join(root, 'src')).filter(name => name.endsWith('.js')))
	for (const [, body] of read(`src/${file}`).matchAll(/@example\s*\n([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/)/g))
		snippets.push({ name: `src/${file} @example`, body: body.replace(/^\s*\* ?/gm, '') });

const entries = { '': 'index.js', '/detect': 'detect.js', '/tokenize': 'tokenize.js', '/languages': 'languages/index.js' };
const rewriteSpec = spec => `../../dist/${entries[spec.slice(pkg.name.length)] ?? spec.slice(pkg.name.length + 1)}`;

// context the fragments assume; stubs are cast to any so tsc checks the
// library calls, not the stubs
const fakeElement = `/** @type {any} */ ({ textContent: 'let x = 1;', innerHTML: '', className: 'shj-lang-js', classList: [], dataset: {}, tagName: 'DIV' })`;
const libraryNames = { highlightHTML: 'index.js', highlightANSI: 'index.js', highlightAll: 'index.js', highlightElement: 'index.js', setLoader: 'index.js', defaultLoader: 'index.js', detectLanguage: 'detect.js', tokenizeWith: 'tokenize.js' };
const providers = {
	code: `const code = 'console.log("hello")';`,
	src: `const src = 'console.log("hello")';`,
	lang: `const lang = 'js';`,
	element: `const element = ${fakeElement};`,
	elm: `const elm = ${fakeElement};`,
	customs: `const customs = {};`,
	setHtml: `const setHtml = () => {};`,
	useState: `const useState = initial => [initial, () => {}];`,
	useEffect: `const useEffect = effect => { const cleanup = effect(); if (typeof cleanup === 'function') cleanup(); };`,
	...Object.fromEntries(Object.entries(libraryNames).map(([name, entry]) => [name, `import { ${name} } from '../../dist/${entry}';`])),
};

const buildModule = body => {
	// urls cannot be imported from tests, jsx cannot run in node
	if (/from\s+['"]https?:/.test(body))
		return null;

	const source = body
		.replace(/(from\s+)['"](?:npm:)?(@speed-highlight\/core[^'"]*)['"]/g, (_, from, spec) => `${from}'${rewriteSpec(spec)}'`)
		.replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '');

	const bound = new Set();
	for (const [, defaultName, named] of source.matchAll(/import\s*(?:([\w$]+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from/g)) {
		bound.add(defaultName);
		for (const name of (named ?? '').split(','))
			bound.add(name.split(' as ').pop().trim());
	}
	for (const [, , name] of source.matchAll(/\b(const|let|var|function)\s+([\w$]+)/g))
		bound.add(name);

	const prelude = Object.entries(providers)
		.filter(([name]) => new RegExp(`\\b${name}\\b`).test(source) && !bound.has(name))
		.map(([, line]) => line);
	prelude.unshift('// @ts-ignore a minimal dom for snippets that highlight the page', 'globalThis.document ??= { querySelectorAll: () => [] };');

	return `${prelude.join('\n')}\n\n${source}`;
};

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const files = snippets
	.map((snippet, index) => ({ ...snippet, module: buildModule(snippet.body), file: path.join(tmp, `snippet-${index}.mjs`) }))
	.filter(({ module }) => module !== null);

test('a healthy number of snippets is collected', () => {
	assert.ok(files.length >= 10, `got only ${files.length} snippets, is the extraction broken?`);
});

for (const { name, file, module } of files) {
	fs.writeFileSync(file, module);
	test(`${name} runs without errors (${path.basename(file)})`, () => import(pathToFileURL(file).href));
}

test('snippets have no type errors', () => {
	try {
		execFileSync(process.execPath, [
			require.resolve('typescript/lib/tsc.js'),
			'--noEmit', '--allowJs', '--checkJs', '--skipLibCheck',
			'--target', 'es2022', '--module', 'nodenext', '--moduleResolution', 'nodenext',
			'--lib', 'es2022,dom,dom.iterable',
			...files.map(({ file }) => file),
		], { cwd: root, encoding: 'utf8' });
	} catch (error) {
		assert.fail(`tsc found type errors in the documentation snippets:\n${error.stdout}`);
	}
});
