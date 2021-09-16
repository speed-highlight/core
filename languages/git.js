export default [
	{
		match: /^#.*/gm,
		type: 'cmnt'
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