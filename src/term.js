/**
 * Deno adaptation
*/

import { tokenize } from './index.js';

let theme = {};

export const highlightText = async (src, lang) => {
	let res = '';

	await tokenize(src, lang, (str, token) => res += token ? `${theme[token] ?? ''}${str}\x1b[0m` : str);

	return res;
};

export const printHighlight = async (...arg) => console.log(await highlightText(...arg));

export const setTheme = async name => theme = (await import(`./themes/${name}.js`)).default;
