/**
 * @module terminal
 * (Terminal adaptor)
*/

/**
 * @typedef {import('./index.js').ShjLanguage} ShjLanguage
 */

/**
 * Languages supported
 * @typedef {('default'|'atom-dark')} ShjTerminalTheme
 */

import { tokenize } from './index.js';

let theme = import('./themes/default.js');

/**
 * Highlight a string passed as argument and return a string that can directly be printed
 *
 * @async
 * @function highlightText
 * @param {string} src The code
 * @param {ShjLanguage} lang The language of the code
 * @returns {Promise<string>} The highlighted string
 */
export const highlightText = async (src, lang) => {
	let res = '', themeMap = (await theme).default;

	await tokenize(src, lang, (str, token) => res += token ? `${themeMap[token] ?? ''}${str}\x1b[0m` : str);

	return res;
};

/**
 * Highlight and print a given string
 *
 * @async
 * @function printHighlight
 * @param {string} src The code
 * @param {ShjLanguage} lang The language of the code
 */
export const printHighlight = async (src, lang) => console.log(await highlightText(src, lang));

/**
 * Change the current used theme for highlighting
 *
 * @function setTheme
 * @param {ShjTerminalTheme} name The name of the theme
 */
export const setTheme = async name => theme = import(`./themes/${name}.js`);