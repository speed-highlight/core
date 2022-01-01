export default [
	{
		match: /[^\[\->+.<\]\s].*/g,
		sub: 'todo'
	},
	{
		type: 'func',
		match: /\.+/g
	},
	{
		type: 'kwd',
		match: /[<>]+/g
	},
	{
		type: 'oper',
		match: /[+-]+/g
	}
]
