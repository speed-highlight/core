/**
 * @name INI
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /(^[ \f\t\v]*)[#;].*/gm,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		type: 'var',
		match: /^.*(?==)/gm
	},
	{
		type: 'section',
		match: /^\s*\[.+\]\s*$/gm
	},
	{
		type: 'oper',
		match: /=/g
	},
	{
		type: 'str',
		match: /.*/g
	},
]);
