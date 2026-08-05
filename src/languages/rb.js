let interpolation = {
	type: 'var',
	match: /#{[^{}]*}/g,
	sub: [
		{
			match: /(?<=^#{)[^]*(?=}$)/g,
			sub: 'rb'
		}
	]
};

export default [
	{
		match: /^=begin[^]*?^=end.*|#.*/gm,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /(?<![\w)\]])<<[-~]?(['"]?)([A-Z_]\w*)\1[^]*?^[\t ]*\2/gm,
		sub: [ interpolation ]
	},
	{
		type: 'str',
		match: /"((?!")[^\r\n\\]|\\[^])*"?/g,
		sub: [ interpolation ]
	},
	{
		expand: 'str'
	},
	{
		type: 'type',
		match: /(?<!:):\w+[?!]?(?!:)|\b\w+:(?![:=])/g
	},
	{
		type: 'kwd',
		match: /\b(alias|and|attr_accessor|attr_reader|attr_writer|begin|break|case|class|def|do|else|elsif|end|ensure|extend|for|if|in|include|module|next|not|or|private|protected|public|puts|raise|redo|require|require_relative|rescue|retry|return|self|super|then|undef|unless|until|when|while|yield)\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false|nil)\b/g
	},
	{
		type: 'var',
		match: /@@?\w+|\$\w+/g
	},
	{
		expand: 'num'
	},
	{
		type: 'class',
		match: /\b[A-Z]\w*\b/g
	},
	{
		type: 'func',
		match: /(?<=\bdef\s+)[\w.]+[!?=]?|(?<=\.)[a-z_]\w*[!?]?|[a-z_]\w*[!?]?(?=\s*[({])/g
	},
	{
		type: 'oper',
		match: /[-+*/%<>=!&|^~,.?:]+/g
	}
]
