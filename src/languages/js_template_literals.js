export default [
	{
		match: new class {
			exec(str) {
				let i = this.lastIndex, j;
				for (; i < str.length; ++i) {
					if (str[i - 1] !== '\\' && str[i] === '$' && str[i + 1] === '{') {
						j = i; i += 2;
						let stack = 1;
						while (i < str.length && stack > 0) {
							if (str[i] === '\\') i++;
							else if (str[i] === '{') stack++;
							else if (str[i] === '}') stack--;
							i++;
						}
						this.lastIndex = i;
						return { index: j, 0: str.slice(j, i) };
					}
				}
				return null;
			}
		}(),
		sub: [
			{
				type: 'kwd',
				match: /^\${|}$/g
			},
			{
				match: /(?!^\$|{)[^]+(?=}$)/g,
				sub: 'js'
			},
		],
	},
];
export let type = 'str';
