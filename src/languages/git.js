export default [
	{
		match: /^#.*/gm,
		sub: 'todo'
	},
	{
		match: /^[-–].*/gm,
		type: 'deleted'
	},
	{
		match: /^\+.*/gm,
		type: 'insert'
	},
	{
		match: /^@@.*@@$/gm,
		type: 'section'
	},
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
