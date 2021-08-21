export default [
	{
		match: /\[((?!\])[^\\]|\\.)*\]/g,
		type: 'num'
	},
	{
		match: /\||\^|\$|\\.|\w+$/g,
		type: 'key'
	},
	{
		match: /\*|\+|\{\d+,\d+\}/g,
		type: 'var'
	}
]