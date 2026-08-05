export default [
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /(@\$?|\$@)"(""|[^"])*"?/g
	},
	{
		type: 'str',
		match: /\$*"""((?!""")[^])*(""")?/g
	},
	{
		type: 'str',
		match: /\$"(\\[^]|[^"\r\n\\])*"?/g,
		sub: [
			{
				type: 'var',
				match: /{[^{}\r\n]*}/g,
				sub: [
					{
						match: /(?!^{)[^]*(?=}$)/g,
						sub: 'cs'
					}
				]
			}
		]
	},
	{
		expand: 'str'
	},
	{
		type: 'num',
		match: /\b\d[\d._]*[dDfFlLmMuU]+\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'type',
		match: /(?<![\w)\]])\[[A-Z]\w*(?=[\][(])/g
	},
	{
		type: 'kwd',
		match: /#[a-z]+\b|\b(abstract|as|ascending|async|await|base|break|case|catch|checked|class|const|continue|default|delegate|descending|do|else|enum|event|explicit|extern|finally|fixed|for|foreach|from|get|goto|group|if|implicit|in|init|interface|internal|into|is|join|let|lock|namespace|new|operator|orderby|out|override|params|partial|private|protected|public|readonly|record|ref|required|return|sealed|select|set|sizeof|stackalloc|static|struct|switch|this|throw|try|typeof|unchecked|unsafe|using|var|virtual|volatile|when|where|while|yield)\b/g
	},
	{
		type: 'type',
		match: /\b(bool|byte|char|decimal|double|dynamic|float|int|long|nint|nuint|object|sbyte|short|string|uint|ulong|ushort|void)\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false|null)\b/g
	},
	{
		type: 'oper',
		match: /[/*+:?&|%^~=!,<>.^-]+/g
	},
	{
		type: 'func',
		match: /[a-zA-Z_]\w*(?=\s*\()/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]
