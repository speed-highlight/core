export default [
	{
		match: /"((?!")[^\\]|\\[^])*"?/g,
		type: 'str'
	},
	{
		match: /,/g,
		type: 'oper'
	}
]
