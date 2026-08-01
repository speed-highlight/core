export default [
	{
		type: 'section',
		match: /^@@.*@@$|^\d.*|^\*\*\*.*|^([+-])\1\1( \S+)?$/gm
	},
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
		match: /^!.*/gm
	}
]
