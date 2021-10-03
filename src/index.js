/**
 * Base script
*/

import expandData_ from './common.js';

const langs_ = {},
	sanitize_ = (str_ = '') =>
		str_.replaceAll('&', '&#38;').replaceAll?.('<', '&lt;').replaceAll?.('>', '&gt;'),
	/**
	 * A function that turn text in HTML to apply a class to it
	 * @param {String} str need to be sanitize to be safe
	 * @param {String} [token] token type
	 * @returns A string with HTML semantics
	 */
	toSpan_ = (str_, token_) => token_ ? `<span class="shj-syn-${token_}">${str_}</span>` : str_;

/**
 * A
 * @param {String} src_
 * @param {String|Object} lang_
 * @param {Function} token_ the callback that will be call for every token found.
 * the arguments pass will be:
 * * the token as a string (can be an empty string)
 * * the token type also as a string like 'err', 'cmnt', ...
 */
export async function tokenize(src_, lang_, token_) {
	let m,
		part_,
		first_ = {},
		match_,
		cache_ = [],
		i = 0,
		data_ = typeof lang_ === 'string' ? (await (langs_[lang_] ??= import(`./languages/${lang_}.js`))) : lang_,
		// make a fast shallow copy to bee able to splice lang without change the original one
		arr_ = [...typeof lang_ === 'string' ? data_.default : lang_.sub];

	while (i < src_.length) {
		first_.index_ = null;
		for (m = arr_.length; m-- > 0;) {
			part_ = arr_[m].expand ? expandData_[arr_[m].expand] : arr_[m];
			// do not call again exec if the previous result is sufficient
			if (cache_[m] === undefined || cache_[m].match_.index < i) {
				part_.match.lastIndex = i;
				match_ = part_.match.exec(src_);
				if (match_ === null) {
					// no more match with this regex can be disposed
					arr_.splice(m, 1);
					cache_.splice(m, 1);
					continue;
				}
				// save match for later use to decrease performance cost
				cache_[m] = { match_: match_, lastIndex_: part_.match.lastIndex };
			}
			// check if it the first match in the string
			if (cache_[m].match_[0] && (cache_[m].match_.index <= first_.index_ || first_.index_ === null))
				first_ = {
					part_: part_,
					index_: cache_[m].match_.index,
					match_: cache_[m].match_[0],
					end_: cache_[m].lastIndex_
				}
		}
		if (first_.index_ === null)
			break;
		token_(src_.slice(i, first_.index_), data_.type);
		i = first_.end_;
		if (first_.part_.sub)
			await tokenize(first_.match_, typeof first_.part_.sub === 'string' ? first_.part_.sub : first_.part_, token_);
		else
			token_(first_.match_, first_.part_.type);
	}
	token_(src_.slice(i, src_.length), data_.type);
}

/**
 * @async
 * @function highlightText A function that highlight a string text and return it
 * @example
 * elm.innerHTML = await highlightText(code, 'js');
 * @param {String} src_ the text content to be highlighted
 * @param {String} lang_ the lang name ex: 'js'
 * @param {Boolean} [multiline_=true] inline mode
 * @param {Object} [options={}] a function call to create all token and add color
 * @returns {String} the highlighted as String text
 */
// why +100ms
export async function highlightText(src_, lang_, multiline_ = true) {
	let res_ = multiline_ ? `<div><div class="shj-numbers">${'<div></div>'.repeat(src_.split('\n').length)}</div><div>` : '';

	await tokenize(src_, lang_, (str, type) => res_ += toSpan_(sanitize_(str), type))

	if (multiline_)
		res_ += '</div></div>';
	return res_;
}

/**
 * @async
 * @function highlightElement highlight a element code with a 'pre' parent
 * @param {HTMLElement} elm_ the code elm
 * @param {String} [lang_] the lang used for syntax highlighting by default is found in the className of the parent or the elm it self
 * @param {Boolean} [multiline_] inline mode by default if not code element
 */
export async function highlightElement(elm_, lang_ = elm_.className.match(/shj-lang-([\w-]+)/)?.[1], multiline_ = elm_.tagName != 'CODE') {
  elm_.dataset.lang = lang_;
  elm_.classList.add('shj-lang-' + lang_);
  elm_.innerHTML = await highlightText(elm_.textContent, lang_, multiline_);
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
    .forEach(elm_ => highlightElement(elm_));