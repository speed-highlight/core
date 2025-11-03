import { detectLanguage } from '../detect.js'

export default [
	{
		type: 'cmnt',
		match: /^>.*|(=|-)\1+/gm
	},
	{
		type: 'class',
		match: /\*\*((?!\*\*).)*\*\*/g
	},
	{
		match: /```((?!```)[^])*\n```/g,
		sub: code => ({
			type: 'kwd',
			sub: [
				{
					match: /\n[^]*(?=```)/g,
					sub: code.split('\n')[0].slice(3) || detectLanguage(code)
				}
			]
		})
	},
	{
		type: 'str',
		match: /`[^`]*`/g
	},
	{
		type: 'var',
		match: /~~((?!~~).)*~~/g
	},
	{
		type: 'kwd',
		match: /\b_\S([^\n]*?\S)?_\b|\*\S([^\n]*?\S)?\*/g
	},
	{
		type: 'kwd',
		match: /^\s*(\*|\d+\.)\s/gm
	},
	{
		type: 'func',
		match: /\[[^\]]*]\([^)]*\)|<[^>]*>/g,
		sub: [
			{
				type: 'oper',
				match: /^\[[^\]]*]/g
			}
		]
	}
]
