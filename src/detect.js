/**
 * @typedef {import('./index.js').ShjLanguage} ShjLanguage
 * @typedef {import('./index.js').ShjBuiltinLanguage} ShjBuiltinLanguage
 */

/**
 * @type {Partial<Record<ShjBuiltinLanguage, [RegExp, number][]>>}
 */
const languages = {
	cobol: [[/\b(IDENTIFICATION|PROCEDURE) +DIVISION *\./g, 500]],
	cpp: [[/\bstd::(cout|cerr|endl)\b|#include <iostream>/g, 500]],
	cs: [[/^using\s+System[\w.]*;/gm, 500]],
	php: [[/^<\?php/g, 500]],
	ps1: [[/\b(Write-(Host|Output)|Get-(Process|ChildItem)|Set-(Location|Content))\b/g, 100], [/\b(?:Get|Set|New|Remove|Write|Move|Select|Where|Join|Test|Compress|Start|Stop|Invoke|Add|Clear|Copy|Out)-[A-Za-z]+\b/g, 50]],
	rb: [[/\b(require_relative|attr_accessor|attr_reader|attr_writer)\b|^=begin\b/gm, 100]],
	vim: [[/\b(nnoremap|inoremap|vnoremap|xnoremap|noremap|augroup|endfunction)\b/g, 100]],
	bash: [[/#!(\/usr)?\/bin\/bash/g, 500], [/\b(if|elif|then|fi|echo)\b|\$/g, 10]],
	html: [[/<\/?[a-z-]+[^\n>]*>/g, 10], [/^\s+<!DOCTYPE\s+html/g, 500]],
	http: [[/^(GET|HEAD|POST|PUT|DELETE|PATCH|HTTP)\b/g, 500]],
	// js: [[/\b(console|await|async|function|export|import|this|class|for|let|const|map|join|require|document|window)\b/g, 10]],
	ts: [[/\b(console|await|async|function|export|import|this|class|for|let|const|map|join|require|document|window|implements|interface|namespace|true|false|null)\b/g, 10]],
	py: [[/\b(def|print|await|async|class|and|or|lambda|import|from|self|asyncio|pass|True|False|None|__init__)\b/g, 10]],
	sql: [[/\b(SELECT|INSERT|FROM)\b/g, 50]],
	pl: [[/#!(\/usr)?\/bin\/perl/g, 500], [/\b(use|print)\b|\$/g, 10]],
	lua: [[/#!(\/usr)?\/bin\/lua/g, 500]],
	make: [[/\b(ifneq|endif|if|elif|then|fi|echo|.PHONY|^[a-z]+ ?:$)\b|\$/gm, 10]],
	uri: [[/https?:|mailto:|tel:|ftp:/g, 30]],
	css: [[/^(@import|@page|@media|(\.|#)[a-z]+)/gm, 20]],
	diff: [[/^[+><-]/gm, 10], [/^@@ ?[-+,0-9 ]+ ?@@/gm, 25]],
	md: [[/^(>|\t\*|\t\d+.)/gm, 10], [/\[.*\](.*)/g, 10]],
	docker: [[/^(FROM|ENTRYPOINT|RUN)/gm, 500]],
	xml: [[/<\/?[a-z-]+[^\n>]*>/g, 10], [/^<\?xml/g, 500]],
	c: [[/#include\b|\bprintf\s+\(/g, 100]],
	rs: [[/^\s+(use|fn|mut|match)\b/gm, 100]],
	go: [[/\b(func|fmt|package)\b/g, 100]],
	java: [[/^import\s+java/gm, 500]],
	asm: [[/^(section|global main|extern|\t(call|mov|ret))/gm, 100]],
	// json: [[/\b(true|false|null)\b|\"[^"]+\":/g, 10]],
	yaml: [[/^(\s+)?[a-z][a-z0-9]*:/gmi, 10]]
}

/**
 * Try to find the language the given code belong to
 *
 * @param {string} code The code
 * @returns {ShjLanguage} The language of the code
 */
export function detectLanguage(code) {
	return (Object.entries(languages)
		.map(([lang, features]) => /** @type {[ShjLanguage, number]} */ ([
			lang,
			features.reduce((acc, [match, score]) => acc + [...code.matchAll(match)].length * score, 0)
		]))
		.filter(([lang, score]) => score > 20)
		.sort((a, b) => b[1] - a[1])[0]?.[0] || 'plain');
}
