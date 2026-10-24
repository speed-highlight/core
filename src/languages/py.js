/**
 * @name Python
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /#.*/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		type: 'str',
		match: /f("""|''')(\\[^]|(?!\1)[^])*\1?|f("|')(\\[^]|(?!\3).)*\3?/gi,
		sub: [
			{
				type: 'var',
				match: new class {
					exec(src) {
						let start, depth = 0,
							strings = /("""|'''|"|')(\\[^]|(?!\1)[^])*\1?/gy;
						for (let i = this.lastIndex; i < src.length; i++) {
							if (!depth && src[i] == '{' && src[i + 1] == '{') i++;
							else if (depth && (src[i] == '"' || src[i] == "'")) {
								strings.lastIndex = i;
								strings.exec(src);
								i = strings.lastIndex - 1;
							}
							else if (src[i] == '{') {
								if (!depth) start = i;
								depth++;
							}
							else if (src[i] == '}' && depth && !--depth) {
								this.lastIndex = i + 1;
								return { index: start, 0: src.slice(start, i + 1) };
							}
						}
						return null;
					}
				}(),
				sub: [
					{
						match: /(?!^{)[^]*(?=}$)/g,
						sub: 'py'
					}
				]
			}
		]
	},
	{
		match: /("""|''')(\\[^]|(?!\1)[^])*\1?/g,
		type: 'cmnt',
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		type: 'kwd',
		match: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g
	},
	{
		type: 'bool',
		match: /\b(False|True|None)\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'func',
		match: /[a-z_]\w*(?=\s*\()/gi
	},
	{
		type: 'oper',
		match: /[-/*+<>,=!&|^%]+/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]);
