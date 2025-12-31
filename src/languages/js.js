export default [
	{
		match: /\/\*\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'jsdoc'
	},
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'todo'
	},
	{
		expand: 'str'
	},
	{
		match: new class {
			exec(str) {
				let i = this.lastIndex;
				for (; i < str.length; i++) {
					if (str[i] === '`') {
						let start = i, stack = 0;
						while (++i < str.length) {
							if (str[i] === '\\') i++;
							else if (str[i] === '$' && str[i + 1] === '{') { stack++; i++; }
							else if (stack > 0 && str[i] === '{') stack++;
							else if (stack > 0 && str[i] === '}') stack--;
							else if (stack === 0 && str[i] === '`') { i++; break; }
						}
						this.lastIndex = i;
						return { index: start, 0: str.slice(start, i) };
					}
				}
				return null;
			}
		}(),
		sub: 'js_template_literals'
	},
	{
		type: 'var',
		match: /\b(?!(?:true|false|null|undefined|NaN|Infinity|this|default)\b)[a-zA-Z_$][\w$]*\b(?=\s*:(?!\s*[:=]))/g
	},
	{
		type: 'kwd',
		match: /=>|(?<!(?<!\.)\.)(?<!\?\.)\b(this|set|get|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|var|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false|NaN|null|undefined|Infinity)\b/g
	},
	{
		type: 'func',
		match: /@[\w$_.]+/g
	},
	{
		type: 'func',
		match: /[#a-zA-Z$_][\w$_]*(?=\s*(\?\.)?\s*\()/g
	},
	{
		type: 'func',
		match: /(?<![(,]\s*)\s*[#a-zA-Z$_][\w$_]*(?=\s*=\s*(\(?[\w,{}\[\]()=. ]+\)? =>|function\b))/g
	},
	{
		type: 'kwd',
		match: /\bstatic\b(?=\s*\{)/g
	},
	{
		type: 'var',
		match: /\b[a-zA-Z$_][\w$_]*(?=\s*=\s*)/g
	},
	{
		type: 'var',
		match: /(?<!(?<!\.)\.)(?<!\?\.)(?<=\.|(?:\?\.\s*))[#a-zA-Z$_][\w$_]*/g
	},
	{
		type: 'type',
		match: /(?<=:\s*)[A-Z][\w$_]*/g
	},
	{
		type: 'func',
		match: /(?<=\.)(?:if|catch|while|for|switch|async)\b(?=\s*\()/g
	},
	{
		type: 'var',
		match: /\b[a-zA-Z$_][\w$_]*(?=\s*:(?!\s*[:=]))/g
	},
	{
		type: 'oper',
		match: /:/g
	},
	{
		match: /(?<=(?:^|[=(,:[!&|?{};<>\+*\-\/%^~]|\b(?:case|else|do|return|throw|typeof|void|yield|await|new|in|instanceof))\s*)\/(?!\s)(?:\\.|\[(?:\\.|\[(?:\\.|[^\]])*\]|[^\]])*\]|(?!\/)[^\r\n\\])+\/[dgimsuyv]*/g,
		sub: 'regex'
	},
	{
		type: 'num',
		match: /(0[bB][01]+(?:_[01]+)*|0[oO][0-7]+(?:_[0-7]+)*|0[xX][0-9a-fA-F]+(?:_[0-9a-fA-F]+)*|(?:\d+_)*\d+(?:\.(?:\d+_)*\d+)?(?:[eE][+-]?(?:\d+_)*\d+)?)n?/g
	},
	{
		type: 'var',
		match: /#[\w$_]+/g
	},
	{
		type: 'oper',
		match: /[/*+:?&|%^~=!,<>.^-]+/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]
