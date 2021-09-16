export default [
	{
		match: /#.*/g,
		type: 'cmnt'
	},
	{
		match: /("""|''')((?!\1)[^]|\\[^])*\1?/g,
		type: 'str'
	},
	{
		expand: 'str'
	},
	{
		match: /^\[.+\]$/gm,
		type: 'section'
	},
	{
		match: /\b(inf|nan)\b|\d[\d:ZT.-]*/g,
		type: 'num'
	},
	{
		expand: 'num'
	},
	{
		match: /\b(true|false)\b/g,
		type: 'bool'
	},
	{
		match: /[+,.=-]/g,
		type: 'oper'
	},
	{
		match: /\w+(?= \=)/g,
		type: 'var'
	}
]