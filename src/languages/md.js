/**
 * @name Markdown
 */

import { detectLanguage } from '../detect.js';

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		// a single = can only underline a heading, while a single - is an empty
		// list item, and the cmnt rule comes first so it would win that tie
		type: 'cmnt',
		match: /^>.*|^[ \t]*(=+|-{2,})[ \t]*$/gm
	},
	{
		type: 'section',
		match: /^#{1,6}[ \t]/gm
	},
	{
		type: 'class',
		match: /\*\*.*?\*\*/g
	},
	{
		// the info string cannot be captured: sub only receives match[0]
		match: /^(`{3,}).*\n[^]*?^\1[ \t]*$/gm,
		sub: code => ({
			type: 'kwd',
			sub: [
				{
					match: /\n[^]*(?=```)/g,
					sub: code.split('\n')[0].slice(3) || detectLanguage(code)
				}
			]
		})
	},
	{
		type: 'str',
		match: /`[^`\n]*`/g
	},
	{
		type: 'var',
		match: /~~.*?~~/g
	},
	{
		// emphasis, then list markers: sharing a type lets them share a regex,
		// the alternation order keeps emphasis winning an equal start index
		type: 'kwd',
		match: /\b_\S(.*?\S)?_\b|\*\S(.*?\S)?\*|^[ \t]*([*+-]|\d+[.)])([ \t]|$)/gm
	},
	{
		// the type is not dead: with an array sub the tokenizer keeps the whole
		// rule as data, so this colors what the sub leaves over (the url part)
		type: 'func',
		match: /\[[^\]]*]\([^)]*\)|<[^>]*>/g,
		sub: [
			{
				type: 'oper',
				match: /^\[[^\]]*]/g
			}
		]
	}
]);
