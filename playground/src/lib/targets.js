import manifest from '../../../examples/manifest.js';
import { langIcon } from './languages.js';

// the files of the examples, read raw, so the site shows exactly what the
// repo ships, and what the tests run; any file the manifest names, so no list
// of extensions to keep in step with it
const sources = import.meta.glob(['../../../examples/*/*', '!../../../examples/languages/*', '!**/*.{json,md}'], { query: '?raw', import: 'default', eager: true });
const read = (dir, name) => sources[`../../../examples/${dir}/${name}`];

// the language a file is highlighted as
const langOf = name => {
	const extension = name.split('.').pop();
	return { jsx: 'js', vue: 'html', svelte: 'html' }[extension] ?? extension;
};

// the one edit made to a file: the default theme swapped for the picked one
export const withTheme = (source, { theme, termTheme }) =>
	source.replace(/themes\/default\.(css|js)/g, (_, extension) => `themes/${extension === 'css' ? theme : termTheme}.${extension}`);

export const install = 'npm i @speed-highlight/core';

// the examples with a label, in the manifest's order
export const targets = manifest.filter(example => example.label).map(({ dir, label, files, run }) => ({
	id: dir,
	label,
	icon: langIcon(dir),
	run,
	// importing the package by name means installing it, a cdn or npm: import does not
	install: files.some(name => /from ['"]@speed-highlight\/core/.test(read(dir, name))) && install,
	files: files.map(name => ({ name, lang: langOf(name), icon: langIcon(langOf(name)), source: read(dir, name) })),
}));

export const targetById = Object.fromEntries(targets.map(target => [target.id, target]));
