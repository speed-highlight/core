/**
 * @name HTTP
 * @support keywork, string, punctuation, variable, version
 */

import { detectLanguage } from '../detect.js';

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'kwd',
		match: /^(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH|PRI|SEARCH)\b/gm
	},
	{
		expand: 'str'
	},
	{
		type: 'section',
		match: /\bHTTP\/[\d.]+\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'oper',
		match: /[,;:=]/g
	},
	{
		type: 'var',
		match: /(?<![\w-])[a-zA-Z][\w-]*(?=:)/g
	},
	{
		match: /\n\n[^]*/g,
		sub: detectLanguage
	}
]);
