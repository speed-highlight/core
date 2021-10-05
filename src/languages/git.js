import diff from './diff.js'

export default [
	{
		match: /^#.*/gm,
		sub: 'todo'
	},
	...diff,
	{
		match: /^(\$ )?git(\s.*)?$/gm,
		type: 'func'
	},
	{
		match: /^commit \w+$/gm,
		type: 'kwd'
	},
	{
		expand: 'str'
	}
]
