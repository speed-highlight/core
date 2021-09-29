import expandData from './common.js';

const langs = {},
	sanitize = (str = '') =>
		str.replaceAll('&', '&#38;').replaceAll?.('<', '&lt;').replaceAll?.('>', '&gt;'),
/**
 * A function that turn text in HTML to apply a class to it
 * @param {String} str need to be sanitize to be safe
 * @param {String} [cssClass] if defined the text will be wrapped up in a span element with a class atribute
 * @returns A string with HTML semantics
 */
	toSpan = (str, cssClass) => cssClass ? `<span class="shj-syn-${cssClass}">${str}</span>` : str;
/**
 * @async
 * @function highlightText A function that highlight a string text and return it
 * @example
 * elm.innerHTML = await highlightText(code, 'js');
 * @param {String} src the text content to be highlighted
 * @param {String} lang the lang name ex: 'js'
 * @param {Boolean} [multiline=true] inline mode
 * @returns {String} the highlighted as String text
 */
export async function highlightText(src, lang, multiline = true) {
	let a,
		part,
		res = multiline ? `<div><div class="shj-numbers">${'<div></div>'.repeat(src.split('\n').length)}</div><div>` : '',
		cachedMatch = [],
		index,
		match,
		firstPart,
		firstIndex,
		lastIndex,
		firstMatch,
		i = 0,
		langData = typeof lang === 'string' ? (await (langs[lang] ??= import(`./languages/${lang}.js`))) : {};
		//make a fast shallow copy to bee able to splice lang without change the original one
	if (typeof lang === 'string')
		lang = [...langData.default];

	const addUnsafe = (str, type) => res += toSpan(str, type),
		add = (str, type) => addUnsafe(sanitize(str), type);

	while (i < src.length) {
		firstIndex = null;
		for (a = lang.length; --a >= 0;) {
			part = lang[a].expand ? expandData[lang[a].expand] : lang[a];
			if (cachedMatch[a] === undefined || cachedMatch[a].match.index < i) {
				part.match.lastIndex = i;
				match = part.match.exec(src);
				if (match === null) {
					lang.splice(a, 1);
					cachedMatch.splice(a, 1);
					continue;
				}
				cachedMatch[a] = { match, lastIndex: part.match.lastIndex };
			}
			index = cachedMatch[a].match.index;
			match = cachedMatch[a].match[0];
			if (match && (index <= firstIndex || firstIndex === null)) {
				firstPart = part;
				firstIndex = index;
				firstMatch = match;
				lastIndex = cachedMatch[a].lastIndex;
			}
		}
		if (firstIndex === null)
			break;
		add(src.slice(i, firstIndex), langData.type);
		i = lastIndex;
		if (firstPart.sub)
			res += await highlightText(firstMatch, firstPart.sub, false);
		else
			add(firstMatch, firstPart.type);
	}
	add(src.slice(i, src.length), langData.type);
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
export async function highlightElement(
  elm,
  lang = elm.className.match(/shj-lang-([\w-]+)/)?.[1],
  multiline = elm.tagName != 'CODE'
) {
  elm.dataset.lang = lang;
  elm.classList.add("shj-lang-" + lang);
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