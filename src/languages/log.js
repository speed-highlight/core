export default [
	{
		match: /^#.*/gm,
		type: 'cmnt'
	},
	{
		expand: 'strDouble'
	},
	{
		expand: 'num'
	},
	{
		match: /\b(err(or)?|[a-z_-]*exception|warn|warning|failed|ko|invalid|not ?found|alert|fatal)\b/gi,
		type: 'err'
	},
	{
		match: /\b(null|undefined)\b/gi,
		type: 'num'
	},
	{
		match: /\b(false|true|yes|no)\b/gi,
		type: 'bool'
	},
	{
		match: /\.|,/g,
		type: 'oper'
	}
]
