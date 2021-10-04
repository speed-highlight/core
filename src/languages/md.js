export default [
	{
		match: /^>.*|(=|-)\1+/gm,
		type: 'cmnt'
	},
	{
		match: /\*\*((?!\*\*).)*\*\*/g,
		type: 'class'
	},
	{
		match: /`[^`]*`/g,
		type: 'str'
	},
	{
		match: /~~((?!~~).)*~~/g,
		type: 'var'
	},
	{
		match: /_[^_]*_|\*[^*]*\*/g,
		type: 'kwd'
	},
	{
		match: /^\s*(\*|\d+\.)\s/gm,
		type: 'kwd'
	},
	{
		match: /\[[^\]]*]/g,
		type: 'oper'
	},
	{
		match: /\([^)]*\)/g,
		type: 'func'
	}
]
