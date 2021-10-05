export default [
	{
		match: /^[-<].*/gm,
		type: 'deleted'
	},
	{
		match: /^[+>].*/gm,
		type: 'insert'
	},
	{
		match: /!.*/gm,
		type: 'kwd'
	},
	{
		match: /^@@.*@@$|^\d.*|^([*-+])\1\1.*/gm,
		type: 'section'
	}
]
