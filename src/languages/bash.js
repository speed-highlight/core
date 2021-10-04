let variable_ = {
	match: /\$\w+|\${[^}]*}|\$\([^)]*\)/g,
	type: 'var'
};

export default [
	{
		match: /#.*/g,
		sub: 'todo'
	},
	{
		match: /-[a-zA-Z]+|$<|[&|;]+|\b(unset|readonly|shift|export|if|fi|else|elif|while|do|done|for|until|case|esac|break|continue|exit|return|trap|wait|eval|exec|then|declare|enable|local|select|typeset|time|add|remove|install|update|delete)\b/g,
		type: 'kwd'
	},
	{
		match: /(["'])((?!\1)[^\r\n\\]|\\[^])*\1?/g,
		sub: [ variable_ ],
		type: 'str'
	},
	{
		expand: 'num'
	},
	{
		match: /\b(set|alias|bg|bind|builtin|caller|command|compgen|complete|dirs|disown|echo|enable|eval|exec|exit|fc|fg|getopts|hash|help|history|jobs|kill|let|logout|popd|printf|pushd|pwd|read|set|shift|shopt|source|suspend|test|times|trap|type|ulimit|umask|unalias|unset)\b/g,
		type: 'func'
	},
	{
		match: /\b(true|false)\b/g,
		type: 'bool'
	},
	{
		match: /[a-z_]+(?=\s*\()/g,
		type: 'func'
	},
	{
		match: /[=(){}<>+*/!?~^-]+/g,
		type: 'oper'
	},
	{
		match: /\w+(?=\s*=)/g,
		type: 'var'
	},
	variable_
]
