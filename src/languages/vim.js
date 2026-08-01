export default [
	{
		match: /^[\t ]*".*|(?<=\s)"(?=[\t ]|$)[^"\r\n]*$/gm,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /'([^'\r\n]|'')*'?/g
	},
	{
		expand: 'strDouble'
	},
	{
		type: 'esc',
		match: /<[a-zA-Z][\w-]*>/g
	},
	{
		type: 'kwd',
		match: /\b(abort|augroup|autocmd|break|call|catch|closure|cnoremap|colorscheme|command|const|continue|delcommand|dict|echo|echoerr|echohl|echomsg|echon|else|elseif|endfor|endfunction|endif|endtry|endwhile|execute|filetype|finally|finish|for|function|highlight|iabbrev|if|imap|in|inoremap|let|nmap|nnoremap|nohlsearch|noremap|normal|omap|onoremap|return|runtime|set|setglobal|setlocal|silent|snoremap|source|syntax|throw|tnoremap|try|unlet|unmap|vmap|vnoremap|while|xmap|xnoremap)\b!?/g
	},
	{
		type: 'bool',
		match: /\bv:(true|false|null)\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'func',
		match: /(?<![\w#:])[a-zA-Z_][\w#:]*(?=\s*\()/g
	},
	{
		type: 'var',
		match: /&?\b[abglstvw]:\w*|[$&@]["\w]+/g
	},
	{
		type: 'oper',
		match: /[-+*/%=!<>&|?:.,~^#]+/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]
