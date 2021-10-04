import js_ from './js.js'

export default [
	{
		match: /:\s*(any|void|number|boolean|string|object|never|enum)\b/g,
		type: 'type'
	},
	{
		match: /\b(type|namespace|typedef|interface|public|private|protected|implements|declare|abstract|readonly)\b/g,
		type: 'kwd'
	},
	...js_
]
