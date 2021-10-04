export default [
	{
		match: /#.*/g,
		type: 'cmnt'
	},
	{
		match: /(["'])(\\[^]|(?!\1)[^])*\1?/g,
		type: 'str'
	},
	{
		expand: 'num'
	},
	{
		match: /\b(any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|return|say|state|sub|switch|undef|unless|until|use|when|while|not|and|or|xor)\b/g,
		type: 'kwd'
	},
	{
		match: /[-+*/%~!&<>|=?,]+/g,
		type: 'oper'
	},
	{
		match: /[a-z_]+(?=\s*\()/g,
		type: 'func'
	}
]
