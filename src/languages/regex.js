export default [
	{
		type: 'num',
		match: new class {
			exec(str) {
				let i = this.lastIndex;
				if (str[i] !== '[') return null;
				let start = i, stack = 1;
				while (++i < str.length && stack > 0) {
					if (str[i] === '\\') i++;
					else if (str[i] === '[') stack++;
					else if (str[i] === ']') stack--;
				}
				this.lastIndex = i;
				return { index: start, 0: str.slice(start, i) };
			}
		}(),
		sub: 'regex'
	},
	{
		type: 'kwd',
		match: /\\.|\||\^|\$|\\[bcdDfnrsStvwWv]|\\p\{[a-zA-Z0-9_=]+\}|\\u\{[a-fA-F0-9]+\}|\\u[a-fA-F0-9]{4}|\\x[a-fA-F0-9]{2}|\w+($|\r|\n)/g
	},
	{
		type: 'var',
		match: /\*|\+|\?|\.|\{\d+(?:,\d*)?\}|\\(?=[()])/g
	}
];
export let type = 'oper';
