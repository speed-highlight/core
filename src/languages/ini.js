export default [
	{
		match: /(^[ \f\t\v]*)[#;].*/gm,
		sub: 'todo'
	},
	{
		type: 'var',
		match: /^.*(?==)/gm
	},
	{
		type: 'section',
		match: /^\s*\[.+\]\s*$/gm
	},
	{
		type: 'oper',
		match: /=/g
	},
	{
		type: 'str',
		match: /.*/g
	},
]
