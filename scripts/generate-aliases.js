/**
 * Write src/aliases.js from the `@alias` tags of src/languages/*.js, so the
 * default loader also takes the names markdown fences use (javascript, python...).
 * Run at the start of `.github/workflows/build.sh`, before the bundling, the
 * release commits the result.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const languages = path.join(root, 'src/languages');

/** @returns {[string, string][]} each language file with its `@alias` list, empty when it has none */
export const readTags = () => fs.readdirSync(languages)
	.filter(file => file.endsWith('.js') && file !== 'index.js')
	.sort()
	.map(file => {
		// the header comment only, as for @name in generate-tables.js
		const header = fs.readFileSync(path.join(languages, file), 'utf8').match(/\/\*\*[\s\S]*?\*\//)?.[0] ?? '';
		return [file.slice(0, -3), [...header.matchAll(/@alias[ \t]+(.+)/g)].map(match => match[1]).join(',')];
	});

/** @param {[string, string][]} tags */
export const collectAliases = tags => {
	const aliases = new Map();
	for (const [file, list] of tags)
		for (const alias of list.split(/[\s,]+/).filter(Boolean)) {
			// a taken name would silently load one of the two languages
			if (aliases.has(alias) || tags.some(([name]) => name === alias))
				throw new Error(`the @alias "${alias}" of src/languages/${file}.js is already a language or an alias`);
			// names are looked up lowercased, an alias in another case is never found
			if (alias !== alias.toLowerCase())
				throw new Error(`the @alias "${alias}" of src/languages/${file}.js must be lowercase`);
			aliases.set(alias, file);
		}
	return [...aliases].sort(([a], [b]) => a < b ? -1 : 1);
};

/** @param {[string, string][]} aliases */
export const aliasesModule = aliases => `// generated from the @alias tags of src/languages/*.js by scripts/generate-aliases.js
export default /** @type {Record<string, string>} */ ({
${aliases.map(([alias, file]) => `\t${/^[a-z_$][\w$]*$/.test(alias) ? alias : JSON.stringify(alias)}: '${file}',`).join('\n')}
});
`;

if (import.meta.main)
	fs.writeFileSync(path.join(root, 'src/aliases.js'), aliasesModule(collectAliases(readTags())));
