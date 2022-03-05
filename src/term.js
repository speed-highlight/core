/**
 * Deno adaptation
*/

import { tokenize } from './index.js';

let theme = import('./themes/default.js');

export const highlightText = async (src, lang) => {
	let res = '', themeMap = (await theme).default;

	await tokenize(src, lang, (str, token) => res += token ? `${themeMap[token] ?? ''}${str}\x1b[0m` : str);

	return res;
};

export const printHighlight = async (...arg) => console.log(await highlightText(...arg));

export const setTheme = async name => theme = import(`./themes/${name}.js`);
