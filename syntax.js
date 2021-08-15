const shg_lang = {//str \stuff
	markdown: [
		{
			match: /(#{1,3} .*)/g,
			type: 'var'
		}
	],
	regex: [
		{
			match: /(\w*$)/g,
			type: 'key'
		},
		{
			match: /(\[((?!\])[^\\]||\\.)*\])/g,
			type: 'num'
		},
		{
			match: /(\^|\$)/g,
			type: 'key'
		},
		{
			match: /(\\.|\*|\+|\|\{\d+,\d+\})/g,
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
			type: 'num'
		},
		{
			match: /(\[[\w\s="']+\])/g,
			type: 'var'
		}
	],
	js: [
		{
			match: /(^#!\/.*)/g,
			type: 'cmt'
		},
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
			match: /((["'])((?!\2)[^\r\n\\]||\\.)*\2?)/g,
			type: 'str'
		},
		{
			match: /\b(true|false)\b/g,
			type: 'bool'
		},
		{
			match: /\b(as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|var|set|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b/g,
			//match: /(?<=[\s{}();,])(=>|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|var|set|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)(?=[\s{}();,])/g,
			type: 'key'
		},
		{
			match: /\b(\d+(e\d+)?(\.\d+)?|NaN|null|undefined)\b/g,
			type: 'num'
		},
		{
			match: /(\/((?!\/)[^\r\n\\]||\\.)+\/[dgimsuy]*)/g,
			type: 'func',
			lang: 'regex'
		},
		{
			match: /([/*+:?&|%^~=!,<>.-]+)/g,
			type: 'oper'
		},
		{
			match: /([\w$][\w\d$]*)(?=\s*(\?\.)?\s*\()/g,
			type: 'func'
		},
		{
			match: /(\bthis\b|\w+\s*:)/g,
			//match: /((?<=\.\s*)\w+\b|\bthis\b|\w+\s*:)/g,
			type: 'var'
		},
		{
			match: /\b(class\s+)(\w+)/g,
			type: 'class'
		}
		//template literall
	]
}

const shg = (_ => {
	const sanitize = str => str?.replaceAll?.('<', '&lt;')?.replaceAll?.('>', '&gt;'),
		highlightText = (src, lang) => {
			let res = '',
				index,
				match,
				firstPart,
				firstIndex,
				firstMatch,
				i = 0;

			const addUnsafe = (str, type) => res += type ? `<span class='syn-${type}'>${str}</span>` : str,
				add = (str, type) => addUnsafe(sanitize(str), type);

			lang.forEach(part => part.last = undefined);
			while (i < src.length) {
				firstIndex = null;
				lang = lang.filter(part => {//filter not most memory efficient
					if (firstIndex === 0)
						return 1;
					if (part.last == undefined || part.last.index < i) {
						part.match.lastIndex = i;
						match = part.match.exec(src);
						if (match === null)
							return 0;
						part.last = match;
					}
					index = part.last.index;
					match = part.last[1];
					if (index < firstIndex || firstIndex === null) {
						firstPart = part;
						firstIndex = index;
						firstMatch = match;
					}
					return 1;
				});
				if (firstIndex === null)
					break;
				add(src.slice(i, firstIndex));
				if (firstPart.lang)
					addUnsafe(highlightText(firstMatch, shg_lang[firstPart.lang]), firstPart.type);
				else
					add(firstMatch, firstPart.type);
				i = firstPart.match.lastIndex;
			}
			add(src.slice(i, src.length));
			return res;
		}
		highlightElement = elm => elm.innerHTML = highlightText(elm.innerText, shg_lang.js);

	return { highlightElement }
})()