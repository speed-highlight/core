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
		match: /(?<=^[\s\t]*|[;{(]\s*|\*\/[\s\n\r]*)[\w-]+(?=\s*(?::(?:\s|\n|$|(?=.*[;}]))|<=|>=|<|>|=))/gm
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
		match: /\b(in|from|to|at|vs|nearest|up|down|always|stable|both|none|auto|inherit|initial|unset|revert|normal|all|transparent|currentColor|true|false|block|inline|flex|grid|subgrid|contents|table|absolute|relative|fixed|sticky|static|left|right|top|bottom|center|middle|start|end|baseline|stretch|bold|bolder|lighter|italic|oblique|underline|overline|pre|nowrap|wrap|clip|ellipsis|solid|dashed|dotted|double|groove|ridge|inset|outset|hidden|and|not|only|or|cover|contain|x|y|scroll|visible|pointer|default|zoom|row|column|ease|linear|step|overlay|safe|unsafe|self|first|last|legacy|dense|min|max|fit|available|border|list|flow|ruby|separate|collapse|mix|multiply|screen|darken|lighten|difference|exclusion|hue|saturation|luminosity)(?:-[\w-]+)?\b/g
	},
    {
        type: 'section', 
        match: /::?[\w-]+\b/g
    },
	{
		type: 'type',
		match: /(?:\.|#|::?)[\w-]+|(?<!@[\w-]+\s+)(?<![-\w:])\b[a-z][\w\d-]*(?=[^{};]*\{)|(?<=\b:[a-z-]+\()[a-z][\w\d-]*(?=[^)]*\))/gmi
	}
]