/**
 * Commun used match pattern
*/

export default {
	num: {
		match: /(\.e?)?\d(e-|[\d.oxa-fA-F_])*/g,
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