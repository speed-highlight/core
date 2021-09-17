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
		match: /\b(error|[a-z_-]*exception|warn|warning|failed|ko|invalid|not ?found)\b/gi,
		type: 'kwd'
	}
]