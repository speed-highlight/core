export default {
	str: {
		match: /(["'])((?!\1)[^\r\n\\]|\\[^])*\1?/g,
		type: 'str'
	},
	strDouble: {
		match: /"((?!")[^\r\n\\]|\\[^])*"?/g,
		type: 'str'
	},
}
