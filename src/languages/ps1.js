/**
 * @name PowerShell
 */
/** @type {import('../index.js').ShjRule} */
let variable = {
	type: 'var',
	match: /\$(\{[^}]*\}|\$|\?|_|[a-zA-Z_]\w*(:[a-zA-Z_]\w*)?)/g
};

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /<#((?!#>)[^])*(#>)?/g,
		sub: 'todo'
	},
	{
		match: /#.*/g,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /@("|')\n((?!^\1@)[^])*^\1@/gm,
		sub: [ variable ]
	},
	{
		type: 'str',
		match: /"(`[^]|[^\r\n"`]|"")*"?/g,
		sub: [ variable ]
	},
	{
		type: 'str',
		match: /'(''|[^\r\n'])*'?/g
	},
	{
		type: 'type',
		match: /\[[a-zA-Z_][\w.\[\]]*\]/g
	},
	{
		type: 'kwd',
		match: /\b(begin|break|catch|class|continue|data|define|do|dynamicparam|else|elseif|end|enum|exit|filter|finally|for|foreach|from|function|hidden|if|in|param|process|return|static|switch|throw|trap|try|until|using|var|while)\b/gi
	},
	{
		type: 'kwd',
		match: /-(eq|ne|gt|ge|lt|le|like|notlike|match|notmatch|contains|notcontains|in|notin|replace|and|or|xor|not|band|bor|bxor|bnot|is|isnot|as|f|join)\b/gi
	},
	{
		type: 'bool',
		match: /\$(true|false|null)\b/gi
	},
	{
		expand: 'num'
	},
	{
		type: 'func',
		match: /\b[A-Za-z]+-[A-Za-z]+\b/g
	},
	{
		type: 'oper',
		match: /-[A-Za-z][A-Za-z0-9]*\b(?=\s|$)/g
	},
	{
		type: 'oper',
		match: /[|;=(){}<>!+\-*/%]+/g
	},
	variable
]);
