export default [
	{
		match: /^#.*/gm,
		type: 'cmt'
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
		type: 'key'
	},
	{
		expand: 'str'
	}
]
