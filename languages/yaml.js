export default [
	{
		match: /#.*/g,
		type: 'cmt'
	},
	{
		expand: 'str'
	},
	{
		match: /(>|\|)\r?\n((\s[^\n]*)?(\r?\n|$))*/g,
		type: 'str'
	},
	{
		match: /!![a-z]+/g,
		type: 'type'
	},
	{
		match: /\b(Yes|No)\b/g,
		type: 'bool'
	},
	{
		match: /[+-:]/g,
		type: 'oper'
	},
	{
		expand: 'num'
	},
	{
		match: /[a-zA-Z]\w*(?=:)/g,
		type: 'var'
	}
]