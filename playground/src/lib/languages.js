// the page opens on js, bundled so the prerendered editor already holds it,
// every other sample is fetched on first pick
import jsSample from '../../../examples/languages/test.js?raw';
export const defaultLang = 'js';
export const defaultSample = jsSample;

const samples = {
	...import.meta.glob(['../../../examples/languages/test.*', '!../../../examples/languages/test.js'], { query: '?raw', import: 'default' }),
	'../../../examples/languages/test.js': async () => jsSample,
};

// every language with a sample file, nothing to keep in sync by hand
export const languages = Object.keys(samples).map(path => path.split('/test.').pop()).sort();
export const loadSample = name => samples[`../../../examples/languages/test.${name}`]();

// icons from bearded-icons (see the footer credit)
const iconUrls = import.meta.glob('../icons/*.svg', { query: '?url', import: 'default', eager: true });
export const icon = name => iconUrls[`../icons/${name}.svg`];

const iconAliases = {
	ts: 'typescript', py: 'python', rs: 'rust', pl: 'perl', bash: 'shell', make: 'makefile',
	md: 'markdown', 'leanpub-md': 'markdown', ini: 'conf', asm: 'binary', plain: 'txt', jsdoc: 'mkdocs',
};
// a direct name match wins, then the alias, then the generic file icon
export const langIcon = name => icon(name) ?? icon(iconAliases[name]) ?? icon('file');

// what people call the language, as its grammar names it (see vite.config.js),
// the id is what the api takes
const names = __LIBRARY__.languageNames;
export const langName = id => names[id] ?? id;

// extra words the search should find a language by
const keywords = {
	bash: 'shell sh zsh', docker: 'container', git: 'commit', go: 'golang', html: 'htm',
	ini: 'conf config', plain: 'text txt', regex: 'regexp', uri: 'url', xml: 'svg', yaml: 'yml',
};

// prefix matches on the id rank before matches anywhere in the name or keywords
export function searchLanguages(query) {
	const q = query.trim().toLowerCase();
	if (!q)
		return languages;
	const rank = id => {
		const words = `${id} ${names[id] ?? ''} ${keywords[id] ?? ''}`.toLowerCase();
		return id.startsWith(q) ? 0 : words.split(/[\s-]/).some(word => word.startsWith(q)) ? 1 : words.includes(q) ? 2 : -1;
	};
	return languages
		.map(id => [id, rank(id)])
		.filter(([, r]) => r >= 0)
		.sort((a, b) => a[1] - b[1])
		.map(([id]) => id);
}
