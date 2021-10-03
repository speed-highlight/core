export default [
	{
		match: /(^[ \f\t\v]*)[#;].*/gm,
		sub: 'todo'
	},
	{
		match: /.*(?==)/g,
		type: 'var'
	},
	{
		match: /^\s*\[.+\]\s*$/gm,
		type: 'section'
	},
	{
		match: /=/g,
		type: 'oper'
	},
	{
		match: /.*/g,
		type: 'str'
	}
]