/**
 * @module tokenize
 * (Registry free tokenizer)
*/

/**
 * @typedef {import('./index.js').ShjToken} ShjToken
 */

/**
 * @typedef {import('./index.js').ShjLanguageDefinition} ShjLanguageDefinition
 */

/**
 * A language, either the module exporting it or the definition itself
 * @typedef {{ default: ShjLanguageDefinition, type?: ShjToken }|ShjLanguageDefinition} ShjLanguageModule
 */

/**
 * @typedef {Object} ShjTokenizeOptions
 * @property {Object<string, ShjLanguageModule>} [languages={}] The languages a `sub` can refer to by name
 */

import expandData from './common.js';

/**
 * Find the tokens in the given code, yielding the name of every language
 * it needs and expecting its definition to be sent back
 *
 * @generator
 * @function tokenizer
 * @param {string} src The code
 * @param {string|ShjLanguageDefinition|{ sub: ShjLanguageDefinition }} lang The language of the code
 * @param {function(string, ShjToken=):void} token The callback function
 * @yields {string} The name of a language to resolve
 * @returns {Generator<string, void, { default: ShjLanguageDefinition, type?: ShjToken }|undefined>}
 */
export function* tokenizer(src, lang, token) {
	try {
		let m,
			part,
			first = {},
			match,
			cache = [],
			i = 0,
			data = typeof lang === 'string' ? yield lang : lang,
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
				yield* tokenizer(first.match, typeof first.part.sub === 'string' ? first.part.sub : (typeof first.part.sub === 'function' ? first.part.sub(first.match) : first.part), token);
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
 * Find the tokens in the given code and call the given callback,
 * without loading anything: every language used has to be given by the caller
 *
 * @example
 * import json from '@speed-highlight/core/languages/json.js';
 * import { tokenize } from '@speed-highlight/core/tokenize';
 *
 * tokenize(src, { sub: json }, (str, type) => process.stdout.write(str));
 *
 * @function tokenize
 * @param {string} src The code
 * @param {string|ShjLanguageDefinition|{ sub: ShjLanguageDefinition }} lang The language of the code
 * @param {function(string, ShjToken=):void} token The callback function
 * this function will be given
 * * the text of the token
 * * the type of the token
 * @param {ShjTokenizeOptions} [opt={}] Customization options
 */
export function tokenize(src, lang, token, opt = {}) {
	let lng,
		it = tokenizer(src, lang, token),
		res = it.next();

	while (!res.done) {
		lng = opt.languages?.[res.value];
		res = it.next(Array.isArray(lng) ? { default: lng } : lng);
	}
}

