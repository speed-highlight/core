let variable = {
	type: 'var',
	match: /\$\w+|\${[^}]*}|\$\([^)]*\)/g
};

export default [
	{
		sub: 'todo',
		match: /#.*/g
	},
	{
		type: 'str',
		match: /(["'])((?!\1)[^\r\n\\]|\\[^])*\1?/g,
		sub: [ variable ]
	},
	{
		// relative or absolute path
		type: "oper",
		match: /(?<=\s|^)\.*\/[a-z/_.-]+/gi,
	},
	{
		type: 'kwd',
		match: /\s-[a-zA-Z]+|$<|[&|;]+|\b(unset|readonly|shift|export|if|fi|else|elif|while|do|done|for|until|case|esac|break|continue|exit|return|trap|wait|eval|exec|then|declare|enable|local|select|typeset|time|add|remove|install|update|delete)(?=\s|$)/g
	},
	{
		expand: 'num'
	},
	{
		// command
		type: 'func',
		match: /(?<=(^|\||\&\&|\;)\s*)[a-z_.-]+(?=\s|$)/gmi
	},
	{
		type: 'bool',
		match: /(?<=\s|^)(true|false)(?=\s|$)/g
	},
	// {
	// 	// function definition
	// 	type: 'func',
	// 	match: /(?<=\s|^)[a-z_]+(?=\s*\()/g
	// },
	{
		type: 'oper',
		match: /[=(){}<>!]+/g
	},
	{
		type: 'var',
		match: /(?<=\s|^)[\w_]+(?=\s*=)/g
	},
	variable
]
