/**
 * Every example in examples/manifest.js, built and run the way an app would:
 * a page is rendered from its index.html, a command is run as written. Nothing
 * here knows about one example in particular, an example added to the
 * manifest is tested with no change to this file.
 *
 * - each highlighted element of a page must hold exactly what highlightHTML
 *   returns for its text, so escaping, classes and layout are all checked
 * - each command must print the sample it reads, highlighted for a terminal
 * - every import of the package must exist in its exports map
 *
 * The examples resolve the package through this folder's node_modules, a
 * link to the checkout, so they run against dist as installed in an app.
 * No browser: happy-dom provides the document.
 */

import '@angular/compiler';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import manifest from '../../examples/manifest.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const examples = path.join(root, 'examples');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
// inside this folder, so the copies resolve the package from its node_modules
const tmp = path.join(here, '.tmp');

GlobalRegistrator.register({ url: 'http://localhost/' });
const { highlightHTML } = await import('@speed-highlight/core');

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp);
// the samples sit next to the copies as they do next to the examples
fs.symlinkSync(path.join(examples, 'languages'), path.join(tmp, 'languages'), 'junction');
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const read = file => fs.readFileSync(path.join(examples, file), 'utf8');
// the cdn the plain page loads from, a build of this repo
const cdn = /https:\/\/cdn\.jsdelivr\.net\/npm\/@speed-highlight\/core@\d+\//;
const sources = fs.readdirSync(examples, { recursive: true })
	.filter(file => /\.(m?js|jsx|ts|vue|svelte|html|css)$/.test(file) && !file.startsWith('languages') && !file.includes('node_modules'));

// ---- the manifest and the imports

test('the manifest lists every example folder, and the files it shows exist', () => {
	const folders = fs.readdirSync(examples, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && entry.name !== 'languages').map(entry => entry.name);
	assert.deepStrictEqual(manifest.map(example => example.dir).sort(), folders.sort(), 'examples/manifest.js and the folders of examples/ differ');
	for (const { dir, files = [] } of manifest)
		for (const file of files)
			assert.ok(fs.existsSync(path.join(examples, dir, file)), `the manifest shows examples/${dir}/${file}, which does not exist`);
});

test('the examples only import what the package exports', async () => {
	const exported = Object.keys(await import('@speed-highlight/core'));
	// types count too, typescript examples import them by name
	exported.push(...[...fs.readFileSync(path.join(root, 'dist/index.d.ts'), 'utf8').matchAll(/export (?:type|interface) (\w+)/g)].map(match => match[1]));
	const isSubpath = subpath => Object.keys(pkg.exports).some(key => {
		const [prefix, suffix] = key.split('*');
		return key === subpath || (key.includes('*') && subpath.startsWith(prefix) && subpath.endsWith(suffix));
	});

	for (const file of sources) {
		const source = read(file);
		// js imports and requires, css @import, through deno's npm: too
		for (const [, spec] of source.matchAll(/(?:from\s+|import\s+|require\s*\(\s*)['"](?:npm:)?(@speed-highlight\/core[^'"]*)['"]/g))
			assert.ok(isSubpath(spec === pkg.name ? '.' : `.${spec.slice(pkg.name.length)}`), `examples/${file} imports "${spec}", which package.json does not export`);
		for (const [, names] of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](?:npm:)?@speed-highlight\/core['"]/g))
			for (const name of names.split(',').map(name => name.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0]).filter(Boolean))
				assert.ok(exported.includes(name), `examples/${file} imports "${name}", which ${pkg.name} does not export`);
	}
});

// the site swaps the default theme for the one picked, in the files it shows
test('the files the site shows import the default theme, if any', () => {
	for (const { dir, files = [] } of manifest)
		for (const file of files)
			for (const [theme] of read(`${dir}/${file}`).matchAll(/themes\/[\w-]+\.(?:css|js)/g))
				assert.match(theme, /^themes\/default\./, `examples/${dir}/${file} imports ${theme}, the site only swaps themes/default`);
});

// ---- the pages

// typescript pages are angular's, compiled ahead of time with ngc as ng build
// does; its own packages ship partially compiled, @angular/compiler, imported
// above, finishes them
function compileTypescript(dir, entry) {
	const out = path.join(tmp, `${dir}-ngc`);
	const tsconfig = path.join(tmp, `${dir}.tsconfig.json`);
	fs.writeFileSync(tsconfig, JSON.stringify({
		compilerOptions: {
			outDir: out, rootDir: path.join(examples, dir), target: 'es2022', module: 'es2022', moduleResolution: 'bundler',
			strict: true, skipLibCheck: true, paths: { '*': [path.join(here, 'node_modules/*')] },
		},
		files: [path.join(examples, dir, entry)],
		angularCompilerOptions: { strictTemplates: true },
	}));
	execFileSync(process.execPath, [path.join(here, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'), '-p', tsconfig]);
	return path.join(out, entry.replace(/\.ts$/, '.js'));
}

// what vite would do for these files, kept to a few lines of glue
const plugins = [
	{
		// the theme only matters to a browser
		name: 'css',
		setup(build) {
			build.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
		},
	},
	{
		name: 'vue',
		setup(build) {
			build.onLoad({ filter: /\.vue$/ }, async ({ path: file }) => {
				const { parse, compileScript } = await import('vue/compiler-sfc');
				const { descriptor, errors } = parse(fs.readFileSync(file, 'utf8'), { filename: file });
				assert.deepStrictEqual(errors, [], `${file} does not parse`);
				return { contents: compileScript(descriptor, { id: file, inlineTemplate: true }).content, loader: 'js' };
			});
		},
	},
	{
		name: 'svelte',
		setup(build) {
			build.onLoad({ filter: /\.svelte$/ }, async ({ path: file }) => {
				const { compile } = await import('svelte/compiler');
				return { contents: compile(fs.readFileSync(file, 'utf8'), { filename: file }).js.code, loader: 'js' };
			});
		},
	},
];

// a page's script bundled for the browser, from its file or inline
async function bundle(dir, html) {
	const src = html.match(/<script type="module" src="\.\/([^"]+)"><\/script>/)?.[1];
	const inline = html.match(/<script type="module">([^]*?)<\/script>/)?.[1];
	const outfile = path.join(tmp, `${dir}.mjs`);
	await build({
		...src
			? { entryPoints: [src.endsWith('.ts') ? compileTypescript(dir, src) : path.join(examples, dir, src)] }
			// the cdn build is this checkout's dist, through the package
			: { stdin: { contents: inline.replace(new RegExp(`${cdn.source}dist/index\\.js`), pkg.name), resolveDir: here } },
		outfile,
		bundle: true,
		format: 'esm',
		platform: 'browser',
		// the examples have no node_modules, their imports resolve from here
		nodePaths: [path.join(here, 'node_modules')],
		define: { 'process.env.NODE_ENV': '"production"' },
		jsx: 'automatic',
		plugins,
		logLevel: 'error',
	});
	return outfile;
}

// every highlighted element must hold exactly what highlightHTML returns for
// its text; the highlighting is async, so the page is polled until it does
async function expectHighlighted(file) {
	const elements = () => [...document.querySelectorAll('[class*="shj-lang-"]')];
	const expected = element => {
		const block = element.classList.contains('shj-block');
		const showLineNumbers = !!element.querySelector('.shj-numbers > div');
		return highlightHTML(element.textContent, element.className.match(/shj-lang-([\w-]+)/)[1], { block, showLineNumbers });
	};
	// html as the document writes it back: the library escapes & as &#38;
	const serialized = html => Object.assign(document.createElement('template'), { innerHTML: html }).innerHTML;
	const mismatches = async () => (await Promise.all(elements().map(async element => {
		const want = serialized(await expected(element));
		// the themes style a block or an inline element, it has to say which
		const display = ['shj-block', 'shj-inline'].filter(name => element.classList.contains(name));
		return element.innerHTML === want && display.length === 1 ? null : { element: element.outerHTML, want };
	}))).filter(Boolean);

	for (const start = Date.now(); Date.now() - start < 2000;) {
		if (elements().length && !(await mismatches()).length && elements().every(element => element.querySelector('[class*="shj-syn-"]')))
			return;
		await new Promise(resolve => setTimeout(resolve, 10));
	}
	assert.ok(elements().length, `${file} renders nothing with a shj-lang-* class`);
	assert.deepStrictEqual(await mismatches(), [], `${file} does not render what highlightHTML returns`);
	assert.fail(`${file} leaves an element without highlighted tokens`);
}

for (const { dir } of manifest.filter(example => fs.existsSync(path.join(examples, example.dir, 'index.html'))))
	test(`examples/${dir} renders its highlighted code`, async () => {
		const html = read(`${dir}/index.html`);
		// a stylesheet from the cdn is a file of this repo
		for (const [, file] of html.matchAll(new RegExp(`href="${cdn.source}([^"]+)"`, 'g')))
			assert.ok(fs.existsSync(path.join(root, file)), `examples/${dir}/index.html links ${file}, missing from the repo`);

		document.body.innerHTML = html.match(/<body>([^]*)<\/body>/)[1].replace(/<script[^]*?<\/script>/g, '');
		await import(pathToFileURL(await bundle(dir, html)));
		await expectHighlighted(`examples/${dir}`);
	});

// ---- the commands

const hasDeno = (() => {
	try {
		return !!execFileSync('deno', ['--version']);
	} catch {
		return false;
	}
})();

// the sample every command reads, see the manifest
const sample = fs.readFileSync(path.join(examples, 'languages/test.ts'), 'utf8');

for (const { dir, run = [] } of manifest) for (const line of run) {
	const [command, ...args] = line.split(' ');
	test(`examples/${dir}: ${line}`, { skip: command === 'deno' && !hasDeno && 'deno is not installed' }, () => {
		// a copy inside this folder, so the package resolves like in an app
		const copy = path.join(tmp, dir);
		fs.cpSync(path.join(examples, dir), copy, { recursive: true, filter: file => !file.includes('node_modules') });
		const out = execFileSync(command === 'node' ? process.execPath : command, args, { cwd: copy, encoding: 'utf8' });

		assert.match(out, /\x1b\[\d+m/, 'expected the output highlighted for a terminal');
		assert.strictEqual(out.replace(/\x1b\[\d+m/g, ''), `${sample}\n`, 'expected the sample printed back whole');
	});
}
