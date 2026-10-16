/**
 * @name JSON
 * @support string, number, bool, ...
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'var',
		match: /(("|')((?!\2)[^\r\n\\]|\\[^])*\2|[a-zA-Z]\w*)(?=\s*:)/g
	},
	{
		expand: 'str'
	},
	{
		type: 'num',
		match: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g
	},
	{
		type: 'num',
		match: /\bnull\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false)\b/g
	}
]);
