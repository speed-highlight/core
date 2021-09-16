export default [
	{
		match: /#.*/g,
		type: 'cmt'
	},
	{
		match: /("""|''')((?!\1)[^]|\\[^])*\1?/g,
		type: 'str'
	},
	{
		expand: 'str'
	},
	{
		match: /^\[\w+\]$/gm,
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
		match: /[+,.=-]+|\b(true|false)\b/g,
		type: 'oper'
	},
	{
		match: /[a-zA-Z]\w*(?= \=)/g,
		type: 'var'
	}
]