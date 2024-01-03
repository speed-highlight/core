export default [
	{
		type: 'cmnt',
		match: /(;|#).*/gm
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		// value (ex: "$0x1")
		type: 'num',
		match: /\$[\da-fA-F]*\b/g
	},
	{
		type: 'kwd',
		// ex: "section .data"
		match: /^[a-z]+\s+[a-z.]+\b/gm,
		sub: [
			{
				// keyword (ex: "section")
				type: 'func',
				match: /^[a-z]+/g
			}
		]
	},
	{
		// instruction (ex: "mov")
		type: 'kwd',
		match: /^\t*[a-z][a-z\d]*\b/gm,
	},
	{
		match: /%|\$/g,
		type: 'oper'
	}
]
