/**
 * @name GDScript
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /#.*/g,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /("""|''')((?!\1)[^]|\\[^])*\1?/g
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		type: 'kwd',
		match: /@\w+|\b(and|as|assert|await|break|breakpoint|class|class_name|const|continue|elif|else|enum|extends|for|func|if|in|is|match|not|or|pass|preload|return|self|signal|static|super|var|when|while|yield)\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false|null)\b/g
	},
	{
		type: 'type',
		match: /\b(bool|float|int|void)\b/g
	},
	{
		type: 'var',
		match: /\$[\w/]*|(?<![\w)\]"'])%\w+/g
	},
	{
		type: 'func',
		match: /(?<![\w])[a-zA-Z_]\w*(?=\s*\()/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	},
	{
		type: 'oper',
		match: /[+*/%^=~<>!&|:,.?-]+/g
	}
]);
