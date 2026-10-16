/** Registry free tokenizer */

/**
 * Token types
 * @typedef {('deleted'|'err'|'var'|'section'|'kwd'|'class'|'cmnt'|'insert'|'type'|'func'|'bool'|'num'|'oper'|'str'|'esc')} ShjToken
 */

/**
 * A stateful object behaving like a RegExp, as the tokenizer
 * only relies on `lastIndex` and `exec` (a RegExp fits the shape)
 * @typedef {{ lastIndex: number, exec: (str: string) => ({ index: number, 0: string }|null) }} ShjMatcher
 */

/**
 * One rule: a pattern to tag with a token type, one of the shared
 * patterns reused by name, or a region to re-tokenize with another language
 * @typedef {{ expand: ('num'|'str'|'strDouble'), match?: undefined }
 *   | {
 *       match: ShjMatcher,
 *       type?: ShjToken,
 *       sub?: string | ShjGrammar | ((code: string) => string | ShjLanguageData),
 *       expand?: undefined
 *     }
 * } ShjRule
 */

/**
 * The rules of a language
 * @typedef {ShjRule[]} ShjGrammar
 */

/**
 * A language: its grammar alone, or with the type
 * given to the text the grammar does not match
 * @typedef {ShjGrammar | { type?: ShjToken, sub: ShjGrammar }} ShjLanguageData
 */

/**
 * Called with the text and type of every token found
 * @typedef {(text: string, token?: ShjToken) => void} ShjTokenCallback
 */


/** @type {Record<string, { type: ShjToken, match: RegExp }>} */
const expandData = {
	num: {
		type: 'num',
		match: /(\.e?|\b)\d(e-|[\d.oxa-fA-F_])*(\.|\b)/g
	},
	str: {
		type: 'str',
		match: /(["'])(\\[^]|(?!\1)[^\r\n\\])*\1?/g
	},
	strDouble: {
		type: 'str',
		match: /"((?!")[^\r\n\\]|\\[^])*"?/g
	}
};

/**
 * Find the tokens in the given code, yielding the name of every
 * language it needs and expecting it to be sent back
 *
 * @param {string} src The code
 * @param {string|ShjLanguageData} lang The language of the code, by name or given directly
 * @param {ShjTokenCallback} onToken The callback function
 * @param {ShjToken} [fallback] Type for the whole region if the language cannot
 * be resolved, so a sub that is not given keeps the type of the rule embedding it
 * @yields {string} The name of a language to resolve
 * @returns {Generator<string, void, ShjLanguageData|undefined>}
 */
export function* tokenizer(src, lang, onToken, fallback) {
	// outside the try so the catch can emit only what is left
	let i = 0, callbackFailed = false;
	const emit = (str, type) => {
		try {
			onToken(str, type);
		}
		catch (error) {
			callbackFailed = true;
			throw error;
		}
	};
	try {
		let m,
			part,
			first = {},
			match,
			cache = [],
			// an unknown language leaves data undefined, the throw makes the catch emit plain text
			data = /** @type {any} */ (typeof lang === 'string' ? yield lang : lang),
			// make a fast shallow copy to be able to splice it without changing the original one
			arr = [.../** @type {ShjGrammar} */ (data.sub ?? data)];

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
			emit(src.slice(i, first.index), data.type);
			// consume the text before the match now, the match itself only once
			// it is emitted, so a throw in a sub resumes on the match and never
			// repeats or drops it
			i = first.index;
			if (first.part.sub)
				yield* tokenizer(first.match, typeof first.part.sub === 'string' ? first.part.sub : (typeof first.part.sub === 'function' ? first.part.sub(first.match) : first.part), emit, first.part.type);
			else
				emit(first.match, first.part.type);
			i = first.end;
		}
		emit(src.slice(i, src.length), data.type);
	}
	catch (error) {
		if (callbackFailed) throw error;
		emit(src.slice(i), fallback);
	}
}

/**
 * Find the tokens in the given code and call the given callback,
 * without loading anything: every language used has to be given by the caller
 *
 * @example
 * import json from '@speed-highlight/core/languages/json.js';
 * import { tokenizeWith } from '@speed-highlight/core/tokenize';
 * import process from 'node:process';
 *
 * tokenizeWith(src, json, (str, type) => process.stdout.write(str));
 *
 * @param {string} src The code
 * @param {string|ShjLanguageData} lang The language of the code
 * @param {ShjTokenCallback} onToken Called with the text and type of each token
 * @param {{ languages?: Record<string, ShjLanguageData> }} [opt={}] Customization options
 */
export function tokenizeWith(src, lang, onToken, opt = {}) {
	let it = tokenizer(src, lang, onToken),
		res = it.next();

	while (!res.done)
		res = it.next(opt.languages?.[/** @type {string} */ (res.value)]);
}
