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
 * @param {String|Array} lang
 * @param {Function} token the callback that will be call for every token found.
 * the arguments pass will be:
 * * the token as a string (can be an empty string)
 * * the token type also as a string like 'err', 'cmnt', ...
 */
export async function tokenize(src, lang, token) {
	let m,
		part,
		first = {},
		match,
		cache = [],
		i = 0,
		data = typeof lang === 'string' ? (await (langs[lang] ??= import(`./languages/${lang}.js`))) : {};
	// make a fast shallow copy to bee able to splice lang without change the original one
	if (typeof lang === 'string')
		lang = [...data.default];

	while (i < src.length) {
		first.index = null;
		for (m = lang.length; m-- > 0;) {
			part = lang[m].expand ? expandData[lang[m].expand] : lang[m];
			// do not call again exec if the previous result is sufficient
			if (cache[m] === undefined || cache[m].match.index < i) {
				part.match.lastIndex = i;
				match = part.match.exec(src);
				if (match === null) {
					// no more match with this regex can be disposed
					lang.splice(m, 1);
					cache.splice(m, 1);
					continue;
				}
				// save match for later use to decrease performance cost
				cache[m] = { match, lastIndex: part.match.lastIndex };
			}
			// check if it the first match in the string
			if (cache[m].match[0] && (cache[m].match.index <= first.index || first.index === null))
				first = {
					part,
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
			await tokenize(first.match, first.part.sub, token);
		else
			token(first.match, first.part.type);
	}
	token(src.slice(i, src.length), data.type);
}

/**
 * @async
 * @function highlightText A function that highlight a string text and return it
 * @example
 * elm.innerHTML = await highlightText(code, 'js');
 * @param {String} src the text content to be highlighted
 * @param {String} lang the lang name ex: 'js'
 * @param {Boolean} [multiline=true] inline mode
 * @param {Object} [options={}] a function call to create all token and add color
 * @returns {String} the highlighted as String text
 */
// why +100ms
export async function highlightText(src, lang, multiline = true) {
	let res = multiline ? `<div><div class="shj-numbers">${'<div></div>'.repeat(src.split('\n').length)}</div><div>` : '';

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
 * @param {Boolean} [multiline] inline mode by default if not code element
 */
export async function highlightElement(elm, lang = elm.className.match(/shj-lang-([\w-]+)/)?.[1], multiline = elm.tagName != 'CODE') {
  elm.dataset.lang = lang;
  elm.classList.add('shj-lang-' + lang);
  elm.innerHTML = await highlightText(elm.textContent, lang, multiline);
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
    .forEach((elm) => highlightElement(elm));