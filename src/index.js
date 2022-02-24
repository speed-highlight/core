/**
 * Base script
*/

import expandData from './common.js';

const langs = {},
	sanitize = (str = '') =>
		str.replaceAll('&', '&#38;').replaceAll?.('<', '&lt;').replaceAll?.('>', '&gt;'),
	/**
	 * A function that turn text in HTML to apply a class to it
	 * @param {String} str need to be sanitize to be safe
	 * @param {String} [token] token type
	 * @returns A string with HTML semantics
	 */
	toSpan = (str, token) => token ? `<span class="shj-syn-${token}">${str}</span>` : str;

/**
 * A
 * @param {String} src
 * @param {String|Object} lang
 * @param {Function} token the callback that will be call for every token found.
 * the arguments pass will be:
 * * the token as a string (can be an empty string)
 * * the token type also as a string like 'err', 'cmnt', ...
 */
export async function tokenize(src, lang, token) {
	try {
		let m,
			part,
			first = {},
			match,
			cache = [],
			i = 0,
			data = typeof lang === 'string' ? (await (langs[lang] ??= import(`./languages/${lang}.js`))) : lang,
			// make a fast shallow copy to bee able to splice lang without change the original one
			arr = [...typeof lang === 'string' ? data.default : lang.sub];

		while (i < src.length) {
			first.index = null;
			for (m = arr.length; m-- > 0;) {
				part = arr[m].expand ? expandData[arr[m].expand] : arr[m];
				// do not call again exec if the previous result is sufficient
				if (cache[m] === undefined || cache[m].match.index < i) {
					part.match.lastIndex = i;
					match = part.match.exec(src);
					if (match === null) {
						// no more match with this regex can be disposed
						arr.splice(m, 1);
						cache.splice(m, 1);
						continue;
					}
					// save match for later use to decrease performance cost
					cache[m] = { match, lastIndex: part.match.lastIndex };
				}
				// check if it the first match in the string
				if (cache[m].match[0] && (cache[m].match.index <= first.index || first.index === null))
					first = {
						part: part,
						index: cache[m].match.index,
						match: cache[m].match[0],
						end: cache[m].lastIndex
					}
			}
			if (first.index === null)
				break;
			token(src.slice(i, first.index), data.type);
			i = first.end;
			if (first.part.sub)
				await tokenize(first.match, typeof first.part.sub === 'string' ? first.part.sub : (typeof first.part.sub === 'function' ? first.part.sub(first.match) : first.part), token);
			else
				token(first.match, first.part.type);
		}
		token(src.slice(i, src.length), data.type);
	}
	catch {
		token(src);
	}
}

/**
 * @typedef {Object} HighlightOptions
 * @property {boolean} hideLineNumbers - Indicates whether to hide line numbers.
 */

/**
 * @async
 * @function highlightText A function that highlight a string text and return it
 * @example
 * elm.innerHTML = await highlightText(code, 'js');
 * @param {String} src the text content to be highlighted
 * @param {String} lang the lang name ex: 'js'
 * @param {Boolean} [multiline=true] inline mode
 * @param {HighlightOptions} [options={}] other options
 * @returns {String} the highlighted as String text
 */
export async function highlightText(src, lang, multiline = true, options = {}) {
	let res = multiline && !options.hideLineNumbers ? `<div><div class="shj-numbers">${'<div></div>'.repeat(src.split('\n').length)}</div><div>` : '';

	await tokenize(src, lang, (str, type) => res += toSpan(sanitize(str), type))

	if (multiline)
		res += '</div></div>';
	return res;
}

/**
 * @async
 * @function highlightElement highlight a element code with a 'pre' parent
 * @param {HTMLElement} elm the code elm
 * @param {String} [lang] the lang used for syntax highlighting by default is found in the className of the parent or the elm it self
 * @param {String} [mode] can be set to inline multiline or oneline by default it's auto detected: inline if `code` tag else depends of the number of lines
 */
export async function highlightElement(elm, lang = elm.className.match(/shj-lang-([\w-]+)/)?.[1], mode) {
	let txt = elm.textContent;
	mode ??= `${elm.tagName == 'CODE' ? 'in' : (txt.split('\n').length < 2 ? 'one' : 'multi')}line`;
	elm.dataset.lang = lang;
	elm.className = `${[...elm.classList].filter(className => !className.startsWith('shj-') || className.startsWith('shj-mode-')).join(' ')} shj-lang-${lang} shj-${mode}`;
	elm.innerHTML = await highlightText(txt, lang, mode == 'multiline');
}

/**
 * for all element that have a class name starting with "shj-lang-"
 * this function will call highlightElement with the html element as argument
 * The function will select those scheme for example:
 * ```html
 * <div class='shj-lang-[code-language]'>[code]</div>
 * or
 * <code class='shj-lang-[code-language]'>[inline code]</code>
 * ```
 */
export let highlightAll = async () =>
	document
		.querySelectorAll('[class*="shj-lang-"]')
		.forEach(elm => highlightElement(elm));
