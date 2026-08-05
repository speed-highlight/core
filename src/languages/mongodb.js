export default [
	{
		match: /(("|')([^\r\n\\]|\\[^])*?\2|[a-zA-Z]\w*)(?=\s*:)/g
	},
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		match: /^(use|show)[ \t]+[\w-]+/gm,
		sub: [
			{
				type: 'kwd',
				match: /^\w+/g
			},
			{
				type: 'var',
				match: /[\w-]+$/g
			}
		]
	},
	{
		type: 'kwd',
		match: /\$[a-zA-Z]\w*|=>|\b(db|async|await|break|case|catch|const|continue|delete|do|else|finally|for|function|if|in|instanceof|let|new|of|return|switch|this|throw|try|typeof|var|while|yield)\b/g
	},
	{
		type: 'var',
		match: /(?<=\bdb\.)[\w$]+(?=\.)/g
	},
	{
		match: /\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*/g,
		sub: 'regex'
	},
	{
		expand: 'num'
	},
	{
		type: 'bool',
		match: /\b(true|false|null|undefined)\b/g
	},
	{
		type: 'oper',
		match: /[/*+:?&|%^~=!,<>.^-]+/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	},
	{
		type: 'func',
		match: /[a-zA-Z$_][\w$_]*(?=\s*\()/g
	}
]
