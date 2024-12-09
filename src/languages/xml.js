export let 
	NameStartChar = ":A-Z_a-z\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{2FF}\u{370}-\u{37D}\u{37F}-\u{1FFF}\u{200C}-\u{200D}\u{2070}-\u{218F}\u{2C00}-\u{2FEF}\u{3001}-\u{D7FF}\u{F900}-\u{FDCF}\u{FDF0}-\u{FFFD}",
	NameChar = NameStartChar + "\\-\\.0-9\u{B7}\u{0300}-\u{036F}\u{203F}-\u{2040}",
	Name = "[" + NameStartChar + "][" + NameChar + "]*",
	property = `\\s*(\\s+${Name}\\s*(=\\s*([^"\']\\S*|("|\')(\\\\[^]|(?!\\4)[^])*\\4?)?)?\\s*)*`,
	xmlElement = {
		match: RegExp(`<\/?${Name}${property}\/?>`, 'g'),
		sub: [
			{
				type: 'var',
				match: /^<\/?[^\s>\/]+/g,
				sub: [
					{
						type: 'oper',
						match: /^<\/?/g
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
				match: /\/?>/g
			},
			{
				type: 'class',
				match: RegExp(`${Name}`, 'gi')
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
		match: RegExp(`<\\?${Name}${property}\\?>`, 'gi'),
		sub: [
			{
				type: 'oper',
				match: /^<\?|\?>$/g
			},
			{
				type: 'var',
				match: RegExp(`${Name}`, 'gi')
			},
			{
				type: 'str',
				match: /[\s\S]+(?!\\?>)$/g,
				sub: [
					{
						type: 'oper',
						match: /\?>$/g
					},
					{
						type: 'class',
						match: RegExp(`\s*${Name}\s*=\s*("[^"]*"|'[^']*')\s*`, 'gi'),
						sub: [
							{
								type: 'oper',
								match: /=/g
							},
							{
								type: 'str',
								match: /("[^"]*"|'[^']*')/g	
							}
						]
					}
				
				]
			}
		]
	},
	{
		type: 'class',
		match: /<!\[CDATA\[[\s\S]*?\]\]>/gi
	},
	xmlElement,
	{
		type: 'var',
		match: /&(#x?)?[\da-z]{1,8};/gi
	}
]