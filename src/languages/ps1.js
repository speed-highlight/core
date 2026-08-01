let variable = {
	type: 'var',
	match: /\$[\w:]+|\$\{[^}]*\}|\$\([^)]*\)/g
};

export default [
	{
		match: /<#[^]*?#>|#.*/g,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /@(["'])[^]*?\r?\n\1@/g,
		sub: [ variable ]
	},
	{
		type: 'str',
		match: /"(`[^]|[^"`\r\n])*"?/g,
		sub: [
			{
				type: 'esc',
				match: /`[^]/g
			},
			variable
		]
	},
	{
		type: 'str',
		match: /'[^'\r\n]*'?/g
	},
	{
		type: 'bool',
		match: /\$(true|false|null)\b/g
	},
	{
		type: 'kwd',
		match: /\b(begin|break|catch|class|continue|data|do|dynamicparam|else|elseif|end|enum|exit|filter|finally|for|foreach|function|hidden|if|in|param|process|return|static|switch|throw|trap|try|until|using|while)\b/g
	},
	{
		type: 'type',
		match: /\[[a-zA-Z_][\w.]*(\[\]|\([^)]*\))?\]/g
	},
	{
		type: 'func',
		match: /\b[A-Z]\w*-[A-Z]\w*/g
	},
	{
		type: 'kwd',
		match: /(?<=[\s(])-[a-zA-Z]\w*\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'func',
		match: /[a-zA-Z_]\w*(?=\s*\()/g
	},
	{
		type: 'oper',
		match: /[=+\-*/%!<>|&,;.@?:^]+/g
	},
	variable
]
