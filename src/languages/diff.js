/**
 * @name Diff
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'section',
		match: /^@@.*@@$|^\d.*|^\*\*\*.*|^--- (?:a\/[^\r\n]+|\/dev\/null|[^\r\n]*\t[^\r\n]+|\S+)$|^\+\+\+ (?:b\/[^\r\n]+|\/dev\/null|[^\r\n]*\t[^\r\n]+|\S+)$/gm
	},
	{
		type: 'deleted',
		match: /^[-<].*/gm
	},
	{
		type: 'insert',
		match: /^[+>].*/gm
	},
	{
		type: 'kwd',
		match: /^!.*/gm
	}
]);
