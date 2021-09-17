export default [
	{
		match: /("|')?[a-zA-Z]\w*\1(?=\s*:)/g,
		type: 'var'
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		match: /\bnull\b/g,
		type: 'num'
	},
	{
		match: /\b(true|false)\b/g,
		type: 'bool'
	}
]