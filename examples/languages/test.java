//import the language module
import java.util.Scanner;

//token class
class Token {
	public String type;
	public String value;
	public int line;
	public int column;
	public token(String type, String value, int line, int column) {
		this.type = type;
		this.value = value;
		this.line = line;
		this.column = column;
	}
}

//lexer function that take a string and return a list of tokens
List<Token> lexer(String s) {
	List<Token> tokens = new ArrayList<Token>();
	int line = 1;
	int column = 0;
	int i = 0;
	while (i < s.length()) {
		char c = s.charAt(i);
		if (c == '\n') {
			line++;
			column = 0;
		} else {
			column++;
		}
		if (Character.isWhitespace(c)) {
			i++;
			continue;
		}
		if (Character.isDigit(c)) {
			StringBuilder sb = new StringBuilder();
			while (i < s.length() && Character.isDigit(s.charAt(i))) {
				sb.append(s.charAt(i));
				i++;
			}
			tokens.add(new Token("NUMBER", sb.toString(), line, column));
			continue;
		}
		if (Character.isLetter(c)) {
			StringBuilder sb = new StringBuilder();
			while (i < s.length() && Character.isLetter(s.charAt(i))) {
				sb.append(s.charAt(i));
				i++;
			}
			tokens.add(new Token("ID", sb.toString(), line, column));
			continue;
		}
		if (c == '+') {
			tokens.add(new Token("PLUS", "+", line, column));
			i++;
			continue;
		}
		if (c == '-') {
			tokens.add(new Token("MINUS", "-", line, column));
			i++;
			continue;
		}
		if (c == '*') {
			tokens.add(new Token("MULTIPLY", "*", line, column));
}

//function that take a list of tokens and execute the program
void run(List<Token>) {
	Stack<Integer> stack = new Stack<Integer>();
	for (Token token : tokens) {
		if (token.type == "NUMBER") {
			stack.push(Integer.parseInt(token.value));
		} else if (token.type == "ID") {
			stack.push(stack.pop() + stack.pop());
		} else if (token.type == "PLUS") {
			stack.push(stack.pop() + stack.pop());
		} else if (token.type == "MINUS") {
			stack.push(stack.pop() - stack.pop());
		} else if (token.type == "MULTIPLY") {
			stack.push(stack.pop() * stack.pop());
		}
	}
	System.out.println(stack.pop());
}

//main function
public static void main(String[] args) {
	String s = "1+2+3";
	List<Token> tokens = lexer(s);
	run(tokens);
}