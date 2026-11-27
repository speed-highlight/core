/**
 * @name Makefile
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /^\s*#.*/gm,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		type: 'oper',
		match: /[${}()]+/g
	},
	{
		type: 'class',
		match: /.PHONY:/gm
	},
	{
		type: 'section',
		match: /^[\w.]+:/gm
	},
	{
		type: 'kwd',
		match: /\b(ifneq|endif)\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'var',
		match: /\b[A-Z_]+(?=\s*=)/g
	},
	{
		match: /^.*$/gm,
		sub: 'bash'
	}
]);
