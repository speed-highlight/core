/**
 * Regenerate the "Languages supported" and "Themes" tables in README.md
 * from the actual source/dist files, so they can't drift from reality.
 * Run automatically at the end of `.github/workflows/build.sh`, after dist
 * has been built (the size figures are gzip sizes of the built files).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

import aliases from '../src/aliases.js';
import { readReadme, replaceMarkedSection, writeReadme } from './readme.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const readFile = file => fs.readFileSync(path.join(root, file), 'utf8');

const formatSize = bytes =>
	bytes < 1000 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} kB`;

const gzipSizeOf = file => {
	const absolute = path.join(root, file);
	if (!fs.existsSync(absolute))
		return null;
	return zlib.gzipSync(fs.readFileSync(absolute), { level: 9 }).length;
};

// the byte count is always the built dist file's gzip size, the link
// still points at src/ since that's what a reader wants to open
const sizeCell = (distFile, srcFile) => {
	const bytes = gzipSizeOf(distFile);
	return bytes === null ? '–' : `[\`${formatSize(bytes)}\`](${srcFile})`;
};

const supportCell = (supported, distFile, srcFile) => {
	if (!supported)
		return '❌';
	const bytes = gzipSizeOf(distFile);
	return bytes === null ? '✅' : `✅ [\`${formatSize(bytes)}\`](${srcFile})`;
};

const parseLanguageFiles = () => {
	const source = readFile('src/languages/index.js');
	return [...source.matchAll(/^export \{ default as \w+ \} from '\.\/([\w.-]+)\.js';$/gm)]
		.map(match => match[1]);
};

const parseLanguageMeta = file => {
	const source = readFile(`src/languages/${file}.js`);
	const comment = source.match(/\/\*\*[\s\S]*?\*\//)?.[0];
	const name = comment?.match(/@name\s+(.+)/)?.[1]?.trim();
	if (!name)
		throw new Error(`src/languages/${file}.js is missing a "@name" doc comment, needed to generate the README table`);
	const support = comment.match(/@support\s+(.+)/)?.[1]?.trim() ?? '';
	// a language can spell out its own Detection cell, for the cases the
	// detect.js scan gets wrong (js is detected, but reported as ts)
	const detect = comment.match(/@detect\s+(.+)/)?.[1]?.trim();
	return { name, support, detect };
};

const parseDetectedLanguages = () => {
	const source = readFile('src/detect.js');
	return new Set([...source.matchAll(/^\t([a-zA-Z][\w-]*):\s*\[/gm)].map(match => match[1]));
};

const buildLanguagesTable = () => {
	const detected = parseDetectedLanguages();
	const files = parseLanguageFiles();
	const rows = files.map(file => {
		const { name, support, detect } = parseLanguageMeta(file);
		const cssClass = `\`shj-lang-${file}\``;
		const alias = Object.keys(aliases).filter(alias => aliases[alias] === file).map(alias => `\`${alias}\``).join(', ');
		// an explicit @detect wins, remove it if the language gets a real
		// entry in detect.js
		const detection = detect ?? (detected.has(file) ? '✅' : '❌');
		const size = sizeCell(`dist/languages/${file}.js`, `src/languages/${file}.js`);
		return `| ${name} | ${cssClass} | ${alias} | ${support} | ${detection} | ${size} |`;
	});
	const total = files.reduce((sum, file) => sum + (gzipSizeOf(`dist/languages/${file}.js`) ?? 0), 0);

	return [
		`| Name | [CSS Class](#web-usage) | Also as | Support | Detection | Size (gzip, ${formatSize(total)} total) |`,
		'| --- | --- | --- | --- | --- | --- |',
		...rows
	].join('\n');
};

// default first so the table starts with what users get out of the box
const themeOrder = (a, b) => (b === 'default') - (a === 'default') || a.localeCompare(b);

const parseThemeNames = extension =>
	fs.readdirSync(path.join(root, 'src/themes'))
		.filter(file => file.endsWith(extension) && file !== 'termcolor.js')
		.map(file => file.slice(0, -extension.length))
		.sort(themeOrder);

const buildThemesTable = () => {
	const browser = parseThemeNames('.css');
	const terminal = parseThemeNames('.js');
	const names = [...new Set([...browser, ...terminal])].sort(themeOrder);

	const rows = names.map(name => {
		const term = supportCell(terminal.includes(name), `dist/themes/${name}.js`, `src/themes/${name}.js`);
		const web = supportCell(browser.includes(name), `dist/themes/${name}.css`, `src/themes/${name}.css`);
		return `| \`${name}\` | ${term} | ${web} |`;
	});

	return [
		'| Name | Terminal (gzip) | Web (gzip) |',
		'| --- | --- | --- |',
		...rows
	].join('\n');
};

const main = () => {
	let readme = readReadme();
	readme = replaceMarkedSection(readme, 'LANGUAGES', buildLanguagesTable());
	readme = replaceMarkedSection(readme, 'THEMES', buildThemesTable());
	writeReadme(readme);
};

main();
