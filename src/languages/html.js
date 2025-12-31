import xml, { name, properties, xmlElement } from './xml.js'

export const htmlElement = {
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
			match: /style\s*=\s*('[^']*'|"[^"]*")/gi,
			sub: [
				{
					match: /^style\s*=\s*/gi,
					sub: [
						{
							type: 'class',
							match: /^style/gi
						},
						{
							type: 'oper',
							match: /=/g
						}
					]
				},
				{
					match: /('[^']*'|"[^"]*")/g,
					sub: [
						{
							type: 'str', // quotes
							match: /^['"]|['"]$/g
						},
						{
							match: /[^"']+/g,
							sub: 'css'
						}
					]
				}
			]
		},
		{
			match: /on\w+\s*=\s*('[^']*'|"[^"]*")/gi,
			sub: [
				{
					match: /^on\w+\s*=\s*/gi,
					sub: [
						{
							type: 'class',
							match: /^on\w+/gi
						},
						{
							type: 'oper',
							match: /=/g
						}
					]
				},
				{
					match: /('[^']*'|"[^"]*")/g,
					sub: [
						{
							type: 'str', // quotes
							match: /^['"]|['"]$/g
						},
						{
							match: /[^"']+/g,
							sub: 'js'
						}
					]
				}
			]
		},
		...xmlElement.sub
	]
};

export default [
	{
		type: 'class',
		match: /<!DOCTYPE("[^"]*"|'[^']*'|[^"'>])*>/gi,
		sub: [
			{
				type: 'str',
				match: /"[^"]*"|'[^']*'/g
			},
			{
				type: 'oper',
				match: /^<!|>$/g
			},
			{
				type: 'var',
				match: /DOCTYPE/gi
			}
		]
	},
	{
		match: RegExp(`<style${properties}>((?!</style>)[^])*</style\\s*>`, 'g'),
		sub: [
			{
				match: RegExp(`^<style${properties}>`, 'g'),
				sub: htmlElement.sub
			},
			{
				match: RegExp(`${xmlElement.match}|[^]*(?=</style\\s*>$)`, 'g'),
				sub: 'css'
			},
			htmlElement
		]
	},
	{
		match: RegExp(`<script${properties}>((?!</script>)[^])*</script\\s*>`, 'g'),
		sub: [
			{
				match: RegExp(`^<script${properties}>`, 'g'),
				sub: htmlElement.sub
			},
			{
				match: RegExp(`${xmlElement.match}|[^]*(?=</script\\s*>$)`, 'g'),
				sub: 'js'
			},
			htmlElement
		]
	},
	htmlElement,
	...xml
]
