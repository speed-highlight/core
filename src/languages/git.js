import diff from './diff.js'

export default [
	{
		match: /^#.*/gm,
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	...diff,
	{
		type: 'func',
		match: /^(\$ )?git(\s.*)?$/gm
	},
	{
		type: 'kwd',
		match: /^commit \w+$/gm
	}
]
