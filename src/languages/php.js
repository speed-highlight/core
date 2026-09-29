import { heredoc } from './heredoc.js';

/**
 * @name PHP
 */
export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		match: /(^|\?>)[^]*?(?=<\?|$)/g,
		sub: [
			{
				type: 'kwd',
				match: /^\?>/g
			},
			{
				match: /[^]+/g,
				sub: 'html'
			}
		]
	},
	{
		type: 'kwd',
		match: /<\?(php|=)?/g
	},
	{
		match: /(\/\/|#(?!\[))((?!\?>).)*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'todo'
	},
	{
		type: 'str',
		match: heredoc(/<<<(["']?)(\w+)\1/g, false)
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		type: 'var',
		match: /\$+\w+/g
	},
	{
		type: 'kwd',
		match: /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|parent|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false|null)\b/g
	},
	{
		type: 'type',
		match: /\b(bool|float|int|iterable|mixed|never|object|self|string|void)\b/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	},
	{
		type: 'func',
		match: /(?<![\w])[a-zA-Z_]\w*(?=\s*\()/g
	},
	{
		type: 'oper',
		match: /[/*+:?&|%^~=!,<>.@\\-]+/g
	}
]);
