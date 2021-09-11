export default [
	{
		match: /\[((?!\])[^\\]|\\.)*\]/g,
		type: 'num'
	},
	{
		match: /\||\^|\$|\\.|\w+($|\r|\n)/g,
		type: 'key'
	},
	{
		match: /\*|\+|\{\d+,\d+\}/g,
		type: 'var'
	}
]
