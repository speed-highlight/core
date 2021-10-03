import todo_ from './todo.js';

export default [
	{
		match: /@\w+/g,
		type: 'kwd'
	},
	{
		match: /{[\w\s|<>,.@\[\]]+}/g,
		type: 'class'
	},
	{
		match: /\[[\w\s="']+\]/g,
		type: 'var'
	},
	...todo_
]
export let type = 'cmnt';