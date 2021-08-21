export default [
	{
		match: /@\w+/g,
		type: 'key'
	},
	{
		match: /{[\w\s|<>,.@\[\]]+}/g,
		type: 'class'
	},
	{
		match: /\[[\w\s="']+\]/g,
		type: 'var'
	}
]