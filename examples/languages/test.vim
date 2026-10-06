" vim: set ts=4 sw=4 noet:
" quickbuild.vim - a thin wrapper around :make for the sandbox builds.
" FIXME: the endif guard below fires twice when the plugin is sourced by hand.

if exists('g:loaded_quickbuild') || v:version < 800
	finish
endif
let g:loaded_quickbuild = 1

let s:save_cpo = &cpo
set cpo&vim

set number relativenumber
set tabstop=4 shiftwidth=4 noexpandtab
set updatetime=250              " let the swap file settle before we hit make
let s:quote = '"'
let s:sep = has('win32') ? '\' : '/'
let g:quickbuild_command = get(g:, 'quickbuild_command', 'make -j8')

function! s:Log(level, msg) abort
	if a:level ==# 'debug' && !exists('g:quickbuild_verbose')
		return
	endif
	echohl WarningMsg
	echomsg printf('[quickbuild] %s%s %s', a:level, s:quote, a:msg)
	echohl None
endfunction

function! quickbuild#run(...) abort
	let l:target = a:0 > 0 ? a:1 : 'all'
	let &l:errorformat = '%f:%l:%m'
	let l:cmd = g:quickbuild_command . ' -C .' . s:sep . ' ' . shellescape(l:target)
	let @" = l:cmd
	call s:Log('info', 'running ' . l:cmd)
	try
		let l:out = systemlist(l:cmd)
	catch /^Vim:Interrupt$/
		call s:Log('error', v:exception)
		return v:false
	endtry
	cgetexpr l:out
	for l:line in l:out
		if l:line =~# '\v^\s*error'
			call s:Log('error', l:line)
		endif
	endfor
	return v:true
endfunction

command! -nargs=? -complete=file QuickBuild call quickbuild#run(<f-args>)

nnoremap <silent> <leader>b :QuickBuild<CR>
nnoremap <silent> <leader>bc :call quickbuild#run('clean')<CR>
inoremap <expr> <C-Space> pumvisible() ? "\<C-n>" : "\<C-x>\<C-o>"

augroup quickbuild
	autocmd!
	autocmd FileType c,cpp setlocal makeprg=make\ -j8
	autocmd QuickFixCmdPost cgetexpr cwindow 10
augroup END

let &cpo = s:save_cpo
unlet s:save_cpo
