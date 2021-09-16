export default [
	{
		match: /^(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH|PRI|SEARCH)\b/gm,
		type: 'key'
	},
	{
		match: /\bHTTP\/[\d.]+\b/g,
		type: 'key'
	},
	{
		expand: 'str'
	},
	{
		match: /[,;:=]/g,
		type: 'oper'
	},
	{
		match: /[a-zA-Z][\w-]*(?=:)/g,
		type: 'var'
	}
]