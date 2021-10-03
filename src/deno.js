/**
 * Deno adaptation
*/

import { tokenize } from './index.js';

let theme_ = {};

export const highlightText = async (src_, lang_) => {
	let res_ = '';

	await tokenize(src_, lang_, (str_, token_) => res_ += token_ ? `${theme_[token_] ?? ''}${str_}\x1b[0m` : str_);

	return res_;
};

export const printHighlight = async (...arg_) => console.log(await highlightText(...arg_));

export const setTheme = async name_ => theme_ = (await import(`./themes/${name_}.js`)).default;