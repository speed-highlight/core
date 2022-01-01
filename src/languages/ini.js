export default [
	{
		match: /(^[ \f\t\v]*)[#;].*/gm,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /.*/g
	},
	{
		type: 'var',
		match: /.*(?==)/g
	},
	{
		type: 'section',
		match: /^\s*\[.+\]\s*$/gm
	},
	{
		type: 'oper',
		match: /=/g
	}
]
