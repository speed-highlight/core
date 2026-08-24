/**
 * @name CSS
 * @support comment, str, selector, units, function, ...
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /\/\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		type: 'var',
		// a name before a colon is a property, and a custom property is one
		// anywhere, so both win over the selector guessed below, which a
		// nested block would otherwise take them for
		match: /--[\w-]+|\b[\w-]+(?=\s*:)/g
	},
	{
		type: 'kwd',
		// (?=([a-z-]+))\2 fakes an atomic group (JS has none), avoiding
		// catastrophic backtracking a plain [a-z-]+ would have here
		match: /@[\w-]+\b|!important\b|\b(and|not|only|or)\b|\b(?=([a-z-]+))\2(?=[^{}]*{)/g
	},
	{
		type: 'var',
		// (?!\d) keeps a number that opens a value (.3s) out of the class selectors
		match: /(::?|\.)(?!\d)[\w-]+(?=[^{}]*{)/g
	},
	{
		type: 'func',
		match: /#[\w-]+(?=[^{}]*{)/g
	},
	{
		type: 'num',
		match:  /#[\da-f]{3,8}/gi
	},
	{
		type: 'num',
		// any unit rather than a list of them, so the next one css gains needs no edit
		match: /-?\d*\.?\d+([a-z]+|%)?/gi,
		sub: [
			{
				type: 'var',
				match: /[a-z]+|%/gi
			}
		]
	},
	{
		match: /url\([^)]*\)/g,
		sub: [
			{
				type: 'func',
				match: /url(?=\()/g
			},
			{
				type: 'str',
				match: /[^()]+/g
			}
		]
	},
	{
		type: 'func',
		match: /\b[a-zA-Z][\w-]*(?=\s*\()/g
	},
	{
		type: 'num',
		match: /\b[a-z-]+\b/g
	}
]);
