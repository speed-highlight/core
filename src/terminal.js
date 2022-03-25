/**
 * @module terminal
 * (Terminal adaptor)
*/

import '../typedef.js'

import { tokenize } from './index.js';

let theme = import('./themes/default.js');

/**
 * @function highlightText
 * @async
 * Highlight a string passed as argument and return a string that can directly be printed
 * @param {String} src The code
 * @param {ShjLanguage} lang The language of the code
 * @returns {Promise<String>} The highlighted string
 */
export const highlightText = async (src, lang) => {
	let res = '', themeMap = (await theme).default;

	await tokenize(src, lang, (str, token) => res += token ? `${themeMap[token] ?? ''}${str}\x1b[0m` : str);

	return res;
};

/**
 * @function printHighlight
 * @async
 * Highlight and print a given string
 * @param {String} src The code
 * @param {ShjLanguage} lang The language of the code
 */
export const printHighlight = async (src, lang) => console.log(await highlightText(src, lang));

/**
 * @function setTheme
 * Change the current used theme for highlighting
 * @param {ShjTerminalTheme} name The name of the theme
 */
export const setTheme = async name => theme = import(`./themes/${name}.js`);