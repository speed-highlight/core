import { detectLanguage } from '../detect.js'

export default [
	{
		type: 'cmnt',
		match: /^>.*|^[ \t]*(=|-)\1+[ \t]*$/gm
	},
	{
		type: 'section',
		match: /^#{1,6}[ \t]/gm
	},
	{
		type: 'class',
		match: /\*\*.*?\*\*/g
	},
	{
		match: /^(`{3,})(.*)\n[^]*?^\1[ \t]*$/gm,
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
		match: /~~.*?~~/g
	},
	{
		type: 'kwd',
		match: /\b_\S([^\n]*?\S)?_\b|\*\S([^\n]*?\S)?\*/g
	},
	{
		type: 'kwd',
		match: /^[ \t]*([*+-]|\d+[.)])([ \t]|$)/gm
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
