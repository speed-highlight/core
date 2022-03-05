/**
 * Terminal adaptor
*/

import { tokenize } from './index.js';

let theme = import('./themes/default.js');

/**
 * @async
 * @function
 * Highlight a string passed as argument and return a string that can directly be printed
 * @param {String} src The code
 * @param {String} lang The language of the code
 * @returns {String} The highlighted string
 */
export const highlightText = async (src, lang) => {
	let res = '', themeMap = (await theme).default;

	await tokenize(src, lang, (str, token) => res += token ? `${themeMap[token] ?? ''}${str}\x1b[0m` : str);

	return res;
};

/**
 * @async
 * @function
 * Highlight and print a given string
 * @param {String} code The code
 */
export const printHighlight = async (...arg) => console.log(await highlightText(...arg));

/**
 * @function
 * Change the current used theme for highlighting
 * @param {String} name The name of the theme
 */
export const setTheme = async name => theme = import(`./themes/${name}.js`);
