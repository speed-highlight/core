import { detectLanguage } from '../detect.js'

export default [
	{
		match: /^(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH|PRI|SEARCH)\b/gm,
		type: 'kwd',
	},
	{
		match: /\bHTTP\/[\d.]+\b/g,
		type: 'section',
	},
	{
		expand: 'str',
	},
	{
		expand: 'num',
	},
	{
		match: /[,;:=]/g,
		type: 'oper',
	},
	{
		match: /[a-zA-Z][\w-]*(?=:)/g,
		type: 'var',
	},
	{
		match: /\n\n[^]*/g,
		sub: detectLanguage
	}
]
