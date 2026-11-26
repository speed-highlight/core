/**
 * @name YAML
 * @support comment, numbers, variable, string, bool
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /#.*/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		type: 'str',
		match: /(>|\|)\r?\n((\s[^\n]*)?(\r?\n|$))*/g
	},
	{
		type: 'type',
		match: /!![a-z]+/g
	},
	{
		type: 'bool',
		match: /\b(Yes|No)\b/g
	},
	{
		type: 'oper',
		match: /[+:-]/g
	},
	{
		expand: 'num'
	},
	{
		type: 'var',
		match: /(?<![\w-])[a-zA-Z_][\w-]*(?=:)/g
	}
]);
