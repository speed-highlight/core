export default {
	num: {
		match: /(\.e?)?\d[\d.oxa-fA-F_-]*/g,
		type: 'num'
	},
	str: {
		match: /(["'])((?!\1)[^\r\n\\]|\\[^])*\1?/g,
		type: 'str'
	},
	strDouble: {
		match: /"((?!")[^\r\n\\]|\\[^])*"?/g,
		type: 'str'
	},
}