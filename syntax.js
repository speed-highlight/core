// Prism.languages.clike = {
// 	'comment': [
// 		{
// 			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
// 			lookbehind: true,
// 			greedy: true
// 		},
// 		{
// 			pattern: /(^|[^\\:])\/\/.*/,
// 			lookbehind: true,
// 			greedy: true
// 		}
// 	],
// 	'string': {
// 		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
// 		greedy: true
// 	},
// 	'class-name': {
// 		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
// 		lookbehind: true,
// 		inside: {
// 			'punctuation': /[.\\]/
// 		}
// 	},
// 	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
// 	'boolean': /\b(?:true|false)\b/,
// 	'function': /\b\w+(?=\()/,
// 	'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
// 	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
// 	'punctuation': /[{}[\];(),.:]/
// };

const shg_lang = {
	//regex: [
	//],
	js: [
		{
			match: /(\/\/.*\n?|\/\*[^]*\*\/)/g,
			type: 'comment'
		},
		{
			match: /((["']).*[^\\\n]\2)/g,
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
				part;
			const add = (str, type) => res += type ? `<span class='syn-${type}'>${sanitize(str)}</span>` : sanitize(str);

			while (i < src.length) {
				j = -1;
				firstIndex = null;
				for (part of shg_lang.js) {
					part.match.lastIndex = i;
					match = part.match.exec(src);
					if (match !== null) {
						index = match.index;
						match = match[1];
						if (match !== undefined && (index < firstIndex || firstIndex === null))
						{
							firstPart = part;
							firstIndex = index;
							firstMatch = match;
						}
						if (index === 0)
							break;
					}
				}
				if (firstIndex === null)
					break;
				add(src.slice(i, firstIndex));
				add(firstMatch, firstPart.type);
				i = firstPart.match.lastIndex;
			}
			//add last part
			add(src.slice(i, src.length));
		 	elm.innerHTML = res;
			//add end

		}
	// function highlightElement(elm) {
	// 	let src = elm.innerText,
	// 		res = '',
	// 		i = -1,
	// 		slice,
	// 		word,
	// 		match;

	// 	const add = (str, type) => res += type ? `<span class='syn-${type}'>${sanitize(str)}</span>` : sanitize(str),
	// 		addWord = (word, type) => add(src.slice(i, (i += word.length - 1) + 1), type);
	// 		matchWord = str => str.match(/^[a-zA-Z][a-zA-Z0-9_-]*/)?.[0] ?? '',
	// 		js = exitCondition => {
	// 			for (; ++i < src.length;) {
	// 				if (src[i] == exitCondition)
	// 					break;
	// 				slice = src.slice(i);
	// 				word = matchWord(slice);
	// 				if (match = slice.match(/^(\/\/.*\n?|\/\*[^]*\*\/)/)?.[0])
	// 					addWord(match, 'comment');
	// 				else if (['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'throw', 'try', 'typeof', 'void', 'while', 'with', 'yield', 'enum', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield', 'await', 'async', 'abstract', 'boolean', 'byte', 'char', 'double', 'final', 'float', 'goto', 'int', 'long', 'native', 'short', 'synchronized', 'throws', 'transient', 'volatile', 'constructor']
	// 					.includes(word))
	// 					addWord(word, 'keyword');
	// 				else if (word == 'this')
	// 					addWord(word, 'var');
	// 				else if (['let', 'const', 'var', 'class'].includes(word)) {
	// 					add(src.slice(i, (i += word.length)), 'keyword');
	// 					add(src.slice(i, (i += src.slice(i).match(/^[ 	\n\r]*/).length)));
	// 					addWord(matchWord(src.slice(i)), 'var');
	// 				}
	// 				else if (['true', 'false'].includes(word))
	// 					add(src.slice(i, (i += word.length - 1) + 1), 'bool');
	// 				else if (slice.startsWith('=>'))
	// 					add(slice.slice(0, 2), 'keyword') && i++;
	// 				else if (src[i] == '.')
	// 				{
	// 					add(src[i++], 'operator');
	// 					word = matchWord(src.slice(i));
	// 					add(src.slice(i, (i += word.length - 1) + 1), /^[	 ]*(\?\.)?\(/.test(src.slice(i + 1)) ? 'func' : 'var');
	// 				}
	// 				else if (['/', '*', '-', '+', ';', ':', '?', '&', '|', '%', '^', '~', '(', ')', '{', '}', '=', '!', ',', '<', '>'].includes(src[i]))
	// 					add(src[i], 'operator')
	// 				else if (match = slice.match(/^[0-9]+e?[0-9]*\.?[0-9]*/)?.[0])
	// 				{
	// 					add(src.slice(i, (i += match.length - 1) + 1), 'num');
	// 				}
	// 				else if (['NaN', 'null', 'undefined'].includes(word))
	// 					add(src.slice(i, (i += word.length - 1) + 1), 'num');
	// 				else if (word)
	// 					add(src.slice(i, (i += word.length - 1) + 1), /^[	 ]*(\?\.)?\(/.test(src.slice(i + 1)) ? 'func' : null);
	// 				else if (match = slice.match(/^("[^\n"]*|'[^\n']*)/)?.[0])
	// 					add(src.slice(i, (i += match.length) + 1), 'str');
	// 				else if (src[i] == '`') {
	// 					let start = i++;
	// 					while (i < src.length && src[i] != '`') {
	// 						if (src.slice(i, i + 2) == '${') {
	// 							add(src.slice(start, i), 'str');
	// 							add(src.slice(i, ++i + 1), 'var');
	// 							js('}');
	// 							add(src[i], 'var')
	// 							start = i + 1;
	// 						}
	// 						i++;
	// 					}
	// 					add(src.slice(start, i + 1), 'str');
	// 				}
	// 				else
	// 					add(src[i]);
	// 			}
	// 		}
	// 	js();
	// 	elm.innerHTML = res;
	// }

	return {
		highlightElement
	}
})()