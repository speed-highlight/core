const langs = {//str \stuff
	//assembler
	// markdown: [
	// 	{
	// 		match: /(#{1,3} .*)/g,
	// 		type: 'var'
	// 	}
	// ],
	regex: [
		{
			match: /\[((?!\])[^\\]|\\.)*\]/g,
			type: 'num'
		},
		{
			match: /\||\^|\$|\\.|\w+$/g,
			type: 'key'
		},
		{
			match: /\*|\+|\{\d+,\d+\}/g,
			type: 'var'
		}
	],
	jsdoc: [
		{
			match: /@\w+/g,
			type: 'key'
		},
		{
			match: /{[\w\s|<>,.@\[\]]+}/g,
			type: 'class'
		},
		{
			match: /\[[\w\s="']+\]/g,
			type: 'var'
		}
	],
	js_template_literals: [
		{
			match: new class {
				exec(str) {
					let i = this.lastIndex,
						j,
						f = _ => {
							while (++i < str.length - 2)
								if (str[i] == '{')
									f()
								else if (str[i] == '}')
									return;
						};
					for (; ++i < str.length;)
						if (str[i - 1] != '\\' && str[i] == '$' && str[i + 1] == '{') {
							j = i++;
							f(i);
							this.lastIndex = i + 1;
							return { index: j, 0: str.slice(j, i + 1) };
						}
					return null;
				}
			},
			type: 'var',
			lang: 'js',
		}
	],
	js: [
		{
			match: /\/\*\*((?!\*\/)[^])*(\*\/)?/g,
			type: 'cmt',
			lang: 'jsdoc'
		},
		{
			match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
			type: 'cmt'
		},
		{
			match: /(["'])((?!\1)[^\r\n\\]|\\.)*\1?/g,
			type: 'str'
		},
		{
			match: /`((?!`)[^]|\\[^])*`?/g,
			type: 'str',
			lang: 'js_template_literals'
		},
		{
			match: /=>|\b(this|set|get|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|var|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b/g,
			type: 'key'
		},
		{
			match: /\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*/g,
			type: 'oper',
			lang: 'regex'
		},
		{
			match: /[/*+:?&|%^~=!,<>.^-]+|\b(true|false)\b/g,
			type: 'oper'
		},
		{
			match: /\b(\d+(e\d+)?(\.\d+)?|NaN|null|undefined|[A-Z_]+)\b/g,
			type: 'num'
		},
		{
			match: /\b[A-Z]\w*\b/g,
			type: 'class'
		},
		{//bad regex for arrow function
			match: /[\w$][\w\d$]*(?=\s*((\?\.)?\s*\(|=\s*([(\w,[\])]+\)? =>|function\b)))/g,
			type: 'func'
		},//bad
		{
			match: /\w+\s*:/g,
			type: 'var'
		}
	]
},
sanitize = str => str?.replaceAll?.('<', '&lt;')?.replaceAll?.('>', '&gt;');




//import './languages/js.js';

/**
 * A function that highlight a string text and return it
 * @example
 * elm.innerHTML = highlightText(code, 'js');
 *
 * @param {String} src the text content to be highlighted
 * @param {String} lang the lang name ex: 'js'
 * @returns {String} the highlighted as String text
 */

export const highlightText = (src, langname) => {
	if (!langs[langname] || !src)
		return src ?? '';
	let res = '',
		cachedMatch = [],
		index,
		match,
		firstPart,
		firstIndex,
		lastIndex,
		firstMatch,
		i = 0,
		//make a fast shallow copy to bee able to splice lang without change the original one
		lang = [...langs[langname]];

	const addUnsafe = (str = '', type) => res += type ? `<span class='syn-${type}'>${str}</span>` : str,
		add = (str = '', type) => addUnsafe(sanitize(str), type);

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
			//match = cachedMatch[a].match[1];
			match = cachedMatch[a].match[0];
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
		// if (firstPart.before && firstPart.after) {
		// 	let before = firstMatch.match(firstPart.before)?.[0],
		// 		after = firstMatch.match(firstPart.after)?.[0];
		// 	add(before, firstPart.type);
		// 	addUnsafe(highlightText(firstMatch.slice(before?.length ?? 0, -(after?.length ?? 1)), firstPart.lang), firstPart.type);
		// 	add(after, firstPart.type)
		// }
		// else
		if (firstPart.lang)
			addUnsafe(highlightText(firstMatch, firstPart.lang), firstPart.type);
		else
			add(firstMatch, firstPart.type);
	}
	add(src.slice(i, src.length));
	return res;
},

/**
 * highlight a element code with a parent pre
 * @param {HTMLElement} elm the code elm
 */
highlightElement = elm => {
	let lang = (elm.className + ' ' + elm.parentNode.className).match(/lang-([\w-]+)/)?.[1];
	elm.parentNode.dataset.lang = lang;
	elm.innerHTML = highlightText(elm.textContent, lang);
},

/**
 * highlight all element that follow this shema
 * ```html
 * <pre class="lang-*">
 * 	<code>
 * 	</code>
 * </pre>
 * ```
 */
highlightAll = _ => document.querySelectorAll('pre[class*="lang-"] > code').forEach(elm => highlightElement(elm));