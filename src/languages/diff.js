export default [
	{
		type: 'deleted',
		match: /^[-<].*/gm
	},
	{
		type: 'insert',
		match: /^[+>].*/gm
	},
	{
		type: 'kwd',
		match: /!.*/gm
	},
	{
		type: 'section',
		match: /^@@.*@@$|^\d.*|^([*-+])\1\1.*/gm
	}
]
