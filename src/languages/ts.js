/**
 * @name TypeScript
 * @alias typescript
 * @support js syntax, ts keyword, types
 */

import js from './js.js';

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'type',
		match: /:\s*(any|void|number|boolean|string|object|never|enum)\b/g
	},
	{
		type: 'kwd',
		match: /\b(type|namespace|typedef|interface|public|private|protected|implements|declare|abstract|readonly)\b/g
	},
	...js
]);
