/**
 * @name Git
 * @support comment, insert, deleted, string, ...
 */

import diff from './diff.js';

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /^#.*/gm,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'strDouble'
	},
	{
		// an apostrophe in prose is not a quote (ex: "don't")
		type: 'str',
		match: /(?<![\p{L}\p{N}])'[^'\r\n]*'?(?![\p{L}\p{N}])/gu
	},
	...diff,
	{
		type: 'func',
		match: /^(\$ )?git(\s.*)?$/gm
	},
	{
		type: 'kwd',
		match: /^commit \w+$/gm
	}
]);
