/**
 * @name Go
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		type: 'str',
		match: /`[^`]*`?/g
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		type: 'kwd',
		match: /\*|&|\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/g
	},
	{
		type: 'func',
		match: /\b[a-zA-Z_][\w_]*(?=\s*\()/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	},
	{
		type: 'oper',
		match: /:=|[+\-*\/%&|^~=!<>.^-]+/g
	}
]);
