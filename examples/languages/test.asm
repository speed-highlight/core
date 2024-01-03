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

	# https://github.com/speed-highlight/core/issues/39
	vmovddup	2536(%rbx,%rax), %xmm1          # comment
	vmovaps	2528(%rbx,%rax), %xmm3
	vfmadd213ps	%xmm6, %xmm5, %xmm3
	vpslld	$23, %xmm4, %xmm4

	ret