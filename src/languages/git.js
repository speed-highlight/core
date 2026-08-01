import diff from './diff.js'

export default [
	{
		match: /^#.*/gm,
		sub: 'todo'
	},
	{
		expand: 'strDouble'
	},
	{
		// an apostrophe in prose is not a quote (ex: "don't")
		type: 'str',
		match: /(?<![\p{L}\p{N}])'[^'\r\n]*'?(?![\p{L}\p{N}])/gu
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
