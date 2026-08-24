/**
 * @name JSDoc
 */

import todo from './todo.js';

export default /** @satisfies {import('../index.js').ShjLanguageData} */ ({
	type: 'cmnt',
	sub: [
	{
		type: 'kwd',
		match: /@\w+/g
	},
	{
		type: 'type',
		match: /{[\w\s|<>,.@\[\]]+}/g
	},
	{
		type: 'var',
		match: /\[[\w\s="']+\]/g
	},
	...todo.sub
]});
