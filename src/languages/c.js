/**
 * @name C
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		type: 'kwd',
		match: /#\s*include (<.*>|".*")/g,
		sub: [
			{
				type: 'str',
				match: /(<|").*/g
			}
		]
	},
	{
		match: /asm\s*{[^}]*}/g,
		sub: [
			{
				type: 'kwd',
				match: /^asm/g
			},
			{
				//type: 'str',
				match: /[^{}]*(?=}$)/g,
				sub: 'asm'
			}
		]
	},
	{
		type: 'kwd',
		match: /\*+|&+|#[a-z]+\b|\b(asm|auto|double|int|struct|break|else|long|switch|case|enum|register|typedef|char|extern|return|union|const|float|short|unsigned|continue|for|signed|void|default|goto|sizeof|volatile|do|if|static|while)\b/g
	},
	{
		type: 'oper',
		match: /[/*+:?&|%^~=!,<>.^-]+/g
	},
	{
		type: 'func',
		match: /\b[a-zA-Z_]\w*(?=\s*\()/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]);
