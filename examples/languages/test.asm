global main

extern printf

section .data
	fmt: db 'Res: %s',0x0a, 0
	msg: db 'Hello world!',0

section .text
	main:
	mov rsi, msg ; ABI is rdi, rsi
	mov rdi, fmt
	mov rax, 0   ; rax is # of non-int args
	
	call printf

	ret