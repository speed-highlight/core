/**
 * @name CSS
 * @support comment, str, selector, units, function, ...
 */

const comment = {
	match: /\/\*((?!\*\/)[^])*(\*\/)?/g,
	type: 'cmnt',
	sub: 'todo'
};

// a name before a colon is a property, and a custom property is one anywhere,
// so both win over a selector, which a nested block would take them for
const property = {
	type: 'var',
	match: /--[\w-]+|(?<![\w-])[\w-]+(?=\s*:)/g
};

const keyword = {
	type: 'kwd',
	match: /@[\w-]+\b|!important\b|\b(and|not|only|or)\b/g
};

const values = [
	{
		type: 'num',
		match: /#[\da-f]{3,8}/gi
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
		match: /(?<![\w-])-?[a-zA-Z][\w-]*(?=\s*\()/g
	},
	{
		type: 'num',
		match: /\b[a-z-]+\b/g
	}
];

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		// what comes before a `{` is a selector or an at-rule prelude; it starts
		// only after `{`, `}` or `;`, so every character is read once
		match: /(?<![^{};])[^{};]*{/g,
		sub: [
			comment,
			{ expand: 'str' },
			property,
			keyword,
			{
				type: 'kwd',
				match: /\b[a-z-]+/g
			},
			{
				type: 'var',
				// (?!\d) keeps a number that opens a value (.3s) out of the class selectors
				match: /(::?|\.)(?!\d)[\w-]+/g
			},
			{
				type: 'func',
				match: /#[\w-]+/g
			},
			...values
		]
	},
	comment,
	{ expand: 'str' },
	property,
	keyword,
	...values
]);
