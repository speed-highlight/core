export default [
	{
		match: /\/\*[\s\S]*?\*\/|\/\/.*/g,
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		match: /url\((?:(['"])(?:(?!\1).)*\1|[^)]*)\)/g,
		sub: [
			{ type: 'func', match: /^url/g },
			{ type: 'str', match: /[^()]+/g }
		]
	},
	{
		type: 'type',
		match: /@[\w-]+\b/g
	},
	{
		type: 'kwd',
		match: /!important\b/g
	},
	{
		type: 'var',
		match: /--[\w-]+/g
	},
	{
		type: 'var',
		match: /[\w-]+(?=\s*(?::|<=|>=|<|>|=))/g
	},
	{
		type: 'num',
		match: /#[\da-fA-F]{3,8}\b/g
	},
	{
		type: 'num',
		match: /-?(?:\d+\.?\d*|\.\d+)(?:(?:cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|deg|rad|grad|turn|s|ms|fr|dpi|dpcm|dppx|q|lh|rlh|vi|vb|cqw|cqh|cqi|cqb|cqmin|cqmax|dvw|dvh|lvw|lvh|svw|svh)\b|%(?!\w))/gi
	},
	{
		type: 'num',
		match: /-?(?:\d+\.?\d*|\.\d+)(?!\w)/g
	},
	{
		type: 'func',
		match: /[\w-]+(?=\()/g
	},
	{
		type: 'bool',
		match: /\b(auto|inherit|initial|unset|revert|revert-layer|none|normal|all|both|transparent|currentColor|true|false|block|inline|flex|grid|subgrid|contents|table|list-item|run-in|ruby|flexbox|absolute|relative|fixed|sticky|static|left|right|top|bottom|center|middle|start|end|space-between|space-around|space-evenly|baseline|stretch|bold|bolder|lighter|italic|oblique|underline|overline|line-through|uppercase|lowercase|capitalize|pre|nowrap|wrap|break-word|clip|ellipsis|solid|dashed|dotted|double|groove|ridge|inset|outset|hidden|and|not|only|or|from|to)(?:-[\w-]+)?\b/g
	},
	{

		type: 'type',
		match: /(?:\.|#|::?)[a-zA-Z0-9_-]+|(?<!@[\w-]+\s+(?:[\w-]+\s,\s*))(?<![\w-])[a-z][\w-](?![a-z0-9_-])/gmi
	}
]
