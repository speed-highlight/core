let prop = '\\s*(\\s+[a-z-]+\\s*(=\\s*([^"\']\\S*|("|\')(\\\\[^]|(?!\\4)[^])*\\4?)?)?\\s*)*',
	htmlElement = {
		match: RegExp(`<\/?[a-z-]+${prop}\/?>`, 'g'),
		sub: [
			{
				match: /^<\/?[^\s>\/]+/g,
				sub: [
					{
						match: /^<\/?/g,
						type: 'oper'
					}
				],
				type: 'var'
			},
			{
				match: /=\s*([^"']\S*|("|')(\\[^]|(?!\2)[^])*\2?)/g,
				sub: [
					{
						match: /^=/g,
						type: 'oper'
					}
				],
				type: 'str'
			},
			{
				match: /\/?>/g,
				type: 'oper'
			},
			{
				match: /[a-z-]+/gi,
				type: 'class'
			}
		]
	};

export default [
	{
		match: /<!--((?!-->)[^])*-->/g,
		type: 'cmnt'
	},
	{
		match: /<!DOCTYPE("[^"]*"|'[^']*'|[^"'>])*>/gi,
		sub: [
			{
				match: /^<!|>$/g,
				type: 'oper'
			},
			{
				match: /"[^"]*"|'[^']*'/g,
				type: 'str'
			},
			{
				match: /DOCTYPE/gi,
				type: 'var'
			}
		],
		type: 'class'
	},
	{
		match: /<!\[CDATA\[[\s\S]*?\]\]>/gi,
		type: 'class'
	},
	{
		match: RegExp(`<style${prop}>((?!</style>)[^])*</style\\s*>`, 'g'),
		sub: [
			{
				match: RegExp(`^<style${prop}>`, 'g'),
				sub: htmlElement.sub
			},
			{
				match: RegExp(`${htmlElement.match}|[^]*(?=</style\\s*>$)`, 'g'),
				sub: 'css'
			},
			htmlElement
		]
	},
	{
		match: RegExp(`<script${prop}>((?!</script>)[^])*</script\\s*>`, 'g'),
		sub: [
			{
				match: RegExp(`^<script${prop}>`, 'g'),
				sub: htmlElement.sub
			},
			{
				match: RegExp(`${htmlElement.match}|[^]*(?=</script\\s*>$)`, 'g'),
				sub: 'js'
			},
			htmlElement
		]
	},
	htmlElement,
	{
		match: /&(#x?)?[\da-z]{1,8};/gi,
		type: 'var'
	}
]