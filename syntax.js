const shg_lang = {
	//regex: [
	//],
	js: [
		{
			//match: /(^#!\/.*|\/\/.*\n?|\/\*[^]*\*\/)/g,
			match: /(^#!\/.*|\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?)/g,
			type: 'comment'
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
			match: /(?<=[\s{}();,])(=>|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|var|set|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)(?=[\s{}();,])/g,
			type: 'keyword'
		},
		{
			match: /\b(([0-9])+(e[0-9]+)?(\.[0-9]+)?|NaN|null|undefined)\b/g,
			type: 'num'
		},
		{
			match: /([/*+:?&|%^~=!,<>.-]+)/g,
			type: 'operator'
		},
		{
			match: /([\w$][\w0-9$]*)(?=\s*(\?\.)?\s*\()/g,
			type: 'func'
		},
		{
			match: /((?<=\.\s*)\w+|\bthis)\b/g,
			type: 'var'
		},
		{
			match: /(?<=class\s+)(\w+)/g,
			type: 'class'
		}
		//highlight: 'python'
		//template literall
		//regex
		//jsdoc
	]
}

const shg = (_ => {
	const sanitize = str => str.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
		highlightElement = elm => {
			let src = elm.innerText,
				res = '',
				index,
				match,
				firstPart,
				firstIndex,
				firstMatch,
				i = 0,
				lang = shg_lang.js;

			const add = (str, type) => res += type ? `<span class='syn-${type}'>${sanitize(str)}</span>` : sanitize(str);

			while (i < src.length) {
				firstIndex = null;
				lang = lang.filter(part => {
					if (firstIndex === 0)
						return 1;
					if (part.last == undefined || part.last.index < i) {
						part.match.lastIndex = i;
						match = part.match.exec(src);
						if (match === null) {
							part.last = undefined;
							return 0;
						}
						part.last = match;
					}
					index = part.last.index;
					match = part.last[1];
					if (index < firstIndex || firstIndex === null) {
						firstPart = part;
						firstIndex = index;
						firstMatch = match;
					}
					else
						part.last = undefined;
					return 1;
				});
				if (firstIndex === null)
					break;
				add(src.slice(i, firstIndex));
				add(firstMatch, firstPart.type);
				i = firstPart.match.lastIndex;
			}
			add(src.slice(i, src.length));
		 	elm.innerHTML = res;
		}

	return {
		highlightElement
	}
})()