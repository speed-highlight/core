export default [
	{
		type: 'var',
		match: /(("|')((?!\2)[^\r\n\\]|\\[^])*\2|\b[a-zA-Z_]\w*)(?=\s*:)/g
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		type: 'num',
		match: /\bnull\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false)\b/g
	}
]
