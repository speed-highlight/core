export default [
	{
		match: /^\s*#.*/gm,
		sub: 'todo'
	},
	{
		match: /[${}()]+/g,
		type: 'oper'
	},
	{
		match: /.PHONY:/gm,
		type: 'class'
	},
	{
		match: /^[\w.]+:/gm,
		type: 'section'
	},
	{
		match: /\b(ifneq|endif)\b/g,
		type: 'kwd'
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		match: /[A-Z_]+(?=\s*=)/g,
		type: 'var'
	},
	{
		match: /^.*$/gm,
		sub: 'bash'
	}
]
