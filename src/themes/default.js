const black = '\x1b[30m',
	red = '\x1b[31m',
	green = '\x1b[32m',
	gray = '\x1b[90m',
	yellow = '\x1b[33m',
	blue = '\x1b[34m',
	magenta = '\x1b[35m',
	cyan = '\x1b[36m',
	white = '\x1b[37m';

export default {
	deleted: red,
	var: red,
	err: red,
	kwd: red,
	num: yellow,
	class: yellow,
	cmnt: gray,
	insert: green,
	str: green,
	bool: cyan,
	type: blue,
	oper: blue,
	section: magenta,
	func: magenta
};
