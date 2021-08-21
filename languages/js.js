export default [
	{
		match: /\/\*\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmt',
		lang: 'jsdoc'
	},
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmt'
	},
	{
		match: /(["'])((?!\1)[^\r\n\\]|\\.)*\1?/g,
		type: 'str'
	},
	{
		match: /`((?!`)[^]|\\[^])*`?/g,
		type: 'str',
		lang: 'js_template_literals'
	},
	{
		match: /=>|\b(this|set|get|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|var|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b/g,
		type: 'key'
	},
	{
		match: /\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*/g,
		type: 'oper',
		lang: 'regex'
	},
	{
		match: /[/*+:?&|%^~=!,<>.^-]+|\b(true|false)\b/g,
		type: 'oper'
	},
	{
		match: /\b(\d+(e\d+)?(\.\d+)?|NaN|null|undefined|[A-Z_]+)\b/g,
		type: 'num'
	},
	{
		match: /\b[A-Z]\w*\b/g,
		type: 'class'
	},
	{//bad regex for arrow function
		match: /[\w$][\w\d$]*(?=\s*((\?\.)?\s*\(|=\s*([(\w,[\])]+\)? =>|function\b)))/g,
		type: 'func'
	},//bad
	{
		match: /\w+\s*:/g,
		type: 'var'
	}
]