let
	nameStartChar = ":A-Z_a-z\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{2FF}\u{370}-\u{37D}\u{37F}-\u{1FFF}\u{200C}-\u{200D}\u{2070}-\u{218F}\u{2C00}-\u{2FEF}\u{3001}-\u{D7FF}\u{F900}-\u{FDCF}\u{FDF0}-\u{FFFD}",
	nameChar = nameStartChar + "\\-\\.0-9\u{B7}\u{0300}-\u{036F}\u{203F}-\u{2040}";
export let
	name = `[${nameStartChar}][${nameChar}]*`,
	properties = `\\s*(\\s+${name}\\s*(=\\s*([^"']\\S*|("|')(\\\\[^]|(?!\\4)[^])*\\4?)?)?\\s*)*`,
	xmlElement = {
		match: RegExp(`<[\/!?]?${name}${properties}[\/!?]?>`, 'g'),
		sub: [
			{
				type: 'var',
				match: RegExp(`^<[\/!?]?${name}`, 'g'),
				sub: [
					{
						type: 'oper',
						match: /^<[\/!?]?/g
					}
				]
			},
			{
				type: 'str',
				match: /=\s*([^"']\S*|("|')(\\[^]|(?!\2)[^])*\2?)/g,
				sub: [
					{
						type: 'oper',
						match: /^=/g
					}
				]
			},
			{
				type: 'oper',
				match: /[\/!?]?>/g
			},
			{
				type: 'class',
				match: RegExp(name, 'g')
			}
		]
	};

export default [
	{
		match: /<!--((?!-->)[^])*-->/g,
		sub: 'todo'
	},
	{
		type: 'class',
		match: /<!\[CDATA\[[\s\S]*?\]\]>/gi
	},
	xmlElement,
	// https://github.com/speed-highlight/core/issues/49
	{
		type: 'str',
		match: RegExp(`<\\?${name}([^?]|\\?[^?>])*\\?+>`, 'g'),
		sub: [
			{
				type: 'var',
				match: RegExp(`^<\\?${name}`, 'g'),
				sub: [
					{
						type: 'oper',
						match: /^<\?/g
					}
				]
			},
			{
				type: 'oper',
				match: /\?+>$/g
			}
		]
	},
	{
		type: 'var',
		match: /&(#x?)?[\da-z]{1,8};/gi
	}
]
