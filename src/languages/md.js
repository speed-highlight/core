import { detectLanguage } from '../detect.js'

export default [
	{
		match: /^>.*|(=|-)\1+/gm,
		type: 'cmnt'
	},
	{
		match: /\*\*((?!\*\*).)*\*\*/g,
		type: 'class'
	},
	{
		match: /```((?!```)[^])*\n```/g,
		sub: code => ({
			sub: [
				{
					match: /\n[^]*(?=```)/g,
					sub: code.split('\n')[0].slice(3) || detectLanguage(code)
				}
			],
			type: 'kwd'
		})
	},
	{
		match: /`[^`]*`/g,
		type: 'str'
	},
	{
		match: /~~((?!~~).)*~~/g,
		type: 'var'
	},
	{
		match: /_[^_]*_|\*[^*]*\*/g,
		type: 'kwd'
	},
	{
		match: /^\s*(\*|\d+\.)\s/gm,
		type: 'kwd'
	},
	{
		match: /\[[^\]]*]/g,
		type: 'oper'
	},
	{
		match: /\([^)]*\)/g,
		type: 'func'
	}
]
