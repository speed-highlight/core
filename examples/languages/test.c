#include <stdio.h>
#include "my_function_function1.h"

#define TEST_FUNCTION my_function_function1

#pragma GCC diagnostic ignored "-Wunused-parameter"

//some random code example

int fibonaaci(int n) {
	if (n == 0) {
		return 0;
	} else if (n == 1) {
		return 1;
	} else {
		return fibonaaci(n - 1) + fibonaaci(n - 2);
	}
}

typedef struct {
	int x;
	int y;
} Point;

/*
 * This is a comment
 */

int	main(int argc, char **argv)
{
	printf("Hello World!\n");

	Point p;

	asm("movl $1, %0" : "=r"(p.x));
	asm {
		movl $2, %eax
		movl %eax, %ebx
		movl %ebx, %ecx
		movl %ecx, %edx
		movl %edx, %esi
		movl %esi, %edi
		movl %edi, %ebp
		movl %ebp, %esp
	}

	printf("%d\n", fibonaaci(10));

	argv += 1;
	argc -= 1;

	while (argc--) {
		printf("%s\n", *argv++);
	}

	return (0);
}