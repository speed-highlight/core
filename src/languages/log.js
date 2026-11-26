/**
 * @name Log
 * @support number, string, comment, errors
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'cmnt',
		match: /^#.*/gm
	},
	{
		expand: 'strDouble'
	},
	{
		expand: 'num'
	},
	{
		type: 'err',
		match: /\b(err(or)?|\w*exception|warn|warning|failed|ko|invalid|not ?found|alert|fatal)\b/gi
	},
	{
		type: 'num',
		match: /\b(null|undefined)\b/gi
	},
	{
		type: 'bool',
		match: /\b(false|true|yes|no)\b/gi
	},
	{
		type: 'oper',
		match: /\.|,/g
	}
]);
