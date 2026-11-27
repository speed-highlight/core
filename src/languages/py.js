/**
 * @name Python
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /#.*/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		type: 'str',
		match: /f("""|''')(\\[^]|(?!\1)[^])*\1?|f("|')(\\[^]|(?!\3).)*\3?/gi,
		sub: [
			{
				// {{ and }} are literal braces, starting before any field they touch
				type: 'str',
				match: /{{|}}/g
			},
			{
				// one level of nested braces, as in a format spec {x:{width}}
				type: 'var',
				match: /{([^{}]|{[^{}]*})*}/g,				sub: [
					{
						match: /(?!^{)[^]*(?=}$)/g,
						sub: 'py'
					}
				]
			}
		]
	},
	{
		match: /("""|''')(\\[^]|(?!\1)[^])*\1?/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		type: 'kwd',
		match: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g
	},
	{
		type: 'bool',
		match: /\b(False|True|None)\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'func',
		match: /[a-z_]\w*(?=\s*\()/gi
	},
	{
		type: 'oper',
		match: /[-/*+<>,=!&|^%]+/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]);
