export default [
	{
		match: /\/\*\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmnt',
		lang: 'jsdoc'
	},
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		type: 'cmnt'
	},
	{
		expand: 'str'
	},
	{
		match: /`((?!`)[^]|\\[^])*`?/g,
		type: 'str',
		lang: 'js_template_literals'
	},
	{
		match: /=>|\b(this|set|get|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|var|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b/g,
		type: 'kwd'
	},
	{
		match: /\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*/g,
		type: 'oper',
		lang: 'regex'
	},
	{
		expand: 'num'
	},
	{
		match: /\b(NaN|null|undefined|[A-Z_]+)\b/g,
		type: 'num'
	},
	{
		match: /\b(true|false)\b/g,
		type: 'bool'
	},
	{
		match: /[/*+:?&|%^~=!,<>.^-]+/g,
		type: 'oper'
	},
	{
		match: /\b[A-Z]\w*\b/g,
		type: 'class'
	},
	{
	//TODO fix bad regex for arrow function
		match: /[a-zA-Z$][\w$]*(?=\s*((\?\.)?\s*\(|=\s*([(\w,[\])]+\)? =>|function\b)))/g,
		type: 'func'
	},
	//TODO fix bad
	{
		match: /\w+\s*:/g,
		type: 'var'
	}
]