export default [
	{
		match: /\/\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		match: /@\w+\b|\b(and|not|only|or)\b|[a-z-]+(?=[^{}]*{)/g,
		type: 'kwd'
	},
	{
		match: /\b[\w-]+(?=\s*:)|(::?|\.)[\w-]+(?=[^{}]*{)/g,
		type: 'var'
	},
	{
		match: /[+~>*|,;:=]+/g,
		type: 'oper'
	},
	{
		match: /#[\w-]+(?=[^{}]*{)/g,
		type: 'func'
	},
	{
		match: /#[\da-f]{3,8}|\d(\.\d)?(cm|mm|in|px|pt|pc|em|ex|ch|rem|vm|vh|vmin|vmax|%)?/g,
		type: 'num'
	},
	{
		match: /[a-zA-Z]\w*(?=\s*\()/g,
		type: 'func'
	}
]
