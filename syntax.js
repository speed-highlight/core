const shg_lang = {//str \stuff
	//assembler
	// markdown: [
	// 	{
	// 		match: /(#{1,3} .*)/g,
	// 		type: 'var'
	// 	}
	// ],

	regex: [
		{
			match: /(\[((?!\])[^\\]|\\.)*\])/g,
			type: 'num'
		},
		{
			match: /(\||\^|\$|\\.|\w+$)/g,
			type: 'key'
		},
		{
			match: /(\*|\+|\{\d+,\d+\})/g,
			type: 'var'
		}
	],

	jsdoc: [
		{
			match: /(@\w+)/g,
			type: 'key'
		},
		{
			match: /({[\w\s|<>,.@\[\]]+})/g,
			type: 'class'
		},
		{
			match: /(\[[\w\s="']+\])/g,
			type: 'var'
		}
	],
	js_template_literals: [
		{
			match: new class {
				exec(str) {
					let res = null,
						i = this.lastIndex,
						j,
						f = _ => {
							while (i++ < str.length)
								if (str[i] == '{')
									f()
								else if (str[i] == '}')
									return;
						};
					for (; i < str.length; i++)
						if (str[i] == '$' && str[i + 1] == '{' && (i == 0 || str[i - 1] != '\\')) {
							j = i;
							f(i += 2);
							res = { index: j, 1: str.slice(j, ++i) };
							break;
						}
					this.lastIndex = i;
					return res;
				}
			},
			type: 'var',
			before: '${',
			lang: 'js',
			after: '}'
		}
	],
	js: [
		{
			match: /(\/\*\*((?!\*\/)[^])*(\*\/)?)/g,
			type: 'cmt',
			lang: 'jsdoc'
		},
		{
			match: /(\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?)/g,
			type: 'cmt'
		},
		{
			match: /((["'])((?!\2)[^\r\n\\]|\\.)*\2?)/g,
			type: 'str'
		},
		{
			match: /(`((?!`)[^]|\\[^])*`?)/g,
			type: 'str',
			lang: 'js_template_literals'
		},
		{
			match: /(=>|\b(this|set|get|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|var|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b)/g,
			type: 'key'
		},
		{
			match: /(\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*)/g,
			type: 'oper',
			lang: 'regex'
		},
		{
			match: /([/*+:?&|%^~=!,<>.-]+|\btrue|false)\b/g,
			type: 'oper'
		},
		{
			match: /\b(\d+(e\d+)?(\.\d+)?|NaN|null|undefined|[A-Z_]+)\b/g,
			type: 'num'
		},
		{
			match: /\b([A-Z]\w*)\b/g,
			type: 'class'
		},
		{//messy regex for arrow function
			match: /([\w$][\w\d$]*)(?=\s*((\?\.)?\s*\(|=\s*([(\w,[\])]+\)? =>|function\b)))/g,
			type: 'func'
		},
		{
			match: /(\w+\s*:)/g,
			//match: /((?<=\.\s*)\w+\b|\bthis\b|\w+\s*:)/g,
			type: 'var'
		}
	]
}

const shg = (_ => {
	const sanitize = str => str?.replaceAll?.('<', '&lt;')?.replaceAll?.('>', '&gt;'),
		highlightText = (src, langname) => {
			let res = '',
			cachedMatch = [],
			index,
			match,
			firstPart,
			firstIndex,
			lastIndex,
			firstMatch,
			i = 0,
			lang = shg_lang[langname];
			if (!lang || !src)
				return src ?? '';

			const addUnsafe = (str, type) => res += type ? `<span class='syn-${type}'>${str}</span>` : str,
				add = (str, type) => addUnsafe(sanitize(str), type);

			lang = lang.map(part => part);
			while (i < src.length) {
				firstIndex = null;
				for (let a = lang.length; --a >= 0;) {
					let part = lang[a];
					if (cachedMatch[a] == undefined || cachedMatch[a].match.index < i) {
						part.match.lastIndex = i;
						match = part.match.exec(src);
						if (match === null) {
							lang.splice(a, 1);
							cachedMatch.splice(a, 1);
							continue;
						}
						cachedMatch[a] = { match, lastIndex: part.match.lastIndex };
					}
					index = cachedMatch[a].match.index;
					match = cachedMatch[a].match[1];
					if (match && (index <= firstIndex || firstIndex === null)) {
						firstPart = part;
						firstIndex = index;
						firstMatch = match;
						lastIndex = cachedMatch[a].lastIndex;
					}
				}
				if (firstIndex === null)
					break;
				add(src.slice(i, firstIndex));
				i = lastIndex;
				if (firstPart.before && firstPart.after)
				{
					add(firstPart.before, firstPart.type);
					addUnsafe(highlightText(firstMatch.slice(firstPart.before.length, -firstPart.after.length), firstPart.lang), firstPart.type);
					add(firstPart.after, firstPart.type)
				}
				else if (firstPart.lang)
					addUnsafe(highlightText(firstMatch, firstPart.lang), firstPart.type);
				else
					add(firstMatch, firstPart.type);
			}
			add(src.slice(i, src.length));
			return res;
		},
		highlightElement = elm => {
			let lang = (elm.className + ' ' + elm.parentNode.className).match(/lang-([\w-]+)/)?.[1],
				div = document.createElement('div');
			div.className = 'syn-header';
			div.appendChild(document.createTextNode(lang));
			elm.parentNode.insertBefore(div, elm)
			elm.parentNode.classList.add('syn');
			elm.innerHTML = highlightText(elm.innerText, lang);
		};

	return { highlightText, highlightElement };
})()