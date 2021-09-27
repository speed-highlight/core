# Speed Highlight JS

## Light

 * The core is about **2kB** (gzipped & not minified)
 * Languages rules are from **a few bytes** to **2kB**
 * Themes are about **1kB**
 * Language rules needed are automatically loaded

## Fast


## Simple setup

In the header of your html file:
```html
<link rel="stylesheet" href="/path/themes/default.css">
```

In the body of your html file:
```html
<div class='sh-lang-[code-language]'>[code]</div>
or
<code class='sh-lang-[code-language]'>[inline code]</code>
```

In your javascript:
```js
import { highlightAll } from '/path/index.js'
highlightAll();
```
## Languages supported

| Name       | Class name    | Support                                             |
| ---------- | ------------- | -------                                             |
| javascipt  | sh-lang-js    | basic syntax, regex, jsdoc, json, template literals |
| regex      | sh-lang-regex | count, set, ...                                     |
| sql        | sh-lang-sql   | number, string, function, ...                       |
| csv        | sh-lang-csv   | punctuation, ...                                    |
| git        | sh-lang-git   | comment, insert, deleted, string, ...               |
| plain      | sh-lang-plain |                                                     |
| toml       | sh-lang-toml  | comment, table, string, bool, variable              |
| yaml       | sh-lang-yaml  | comment, numbers, variable, string, bool            |
| http       | sh-lang-http  | keywork, string, punctuation, variable, version     |
| log        | sh-lang-log   | number, string, comment, errors                     |
| json       | sh-lang-json  | string, number, bool, ...                           |
| css        | sh-lang-css   | comment, str, selector, units, function, ...        |
| brainfuck  | sh-lang-bf    | increment, operator, print, comment                 |
| typescript | sh-lang-ts    | js syntax, ts keyword, types                        |

## Themes

A modern theme by default

| Name                |
| ------------------- |
| default             |
| github-dark         |
| github-light        |
| github-dim          |
| atom-dark           |
| visual-studio-dark  |

## Create new theme/styles

In your css file you can import the default styling,
then useful things to change can be:
```css
/* token style */
.sh-syn-[token-name] {color...}
/* line numbering style */
.sh-numbers {color...}
/* inline mode style */
code[class*="sh-lang-"] {...}
/* multiline mode style */
[class*="sh-lang-"]:not(code) {...}
/* both */
[class*="sh-lang-"] {default color, background...}
/* header with language name */
[class*="sh-lang-"]:not(code):before {...}
```

## Tokens

| Name       | Description/Usage            |
| ---------- | ---------------------------- |
| deleted    | Deleted part                 |
| err        | Errors                       |
| var        | Variable key                 |
| section    | A section delimiter          |
| kwd        | Language keyword             |
| class      | Class definition and usage   |
| cmnt       | Comments                     |
| insert     | Inserted part                |
| type       | Types                        |
| func       | Function call and definition |
| bool       | Boolean values               |
| num        | Numbers                      |
| oper       | Operators                    |
| str        | String                       |

## Create new languages

To create a new language rules:

Create a file languages/[new-language-name].js

The default export of that file should be an array of object containing all the matching rules

The highlighter will try every match and will take the one with the smallest index in the string,
in the case where two matches start at the same spot the first in the array will be kept

For example:
```js
export default [
	{
		// All regex match property should have the global flag
		match: /helloworld/g,
		// specify the type of token this match is
		type: 'kwd'
	},
	{
		match: /script: .*/g,
		// will load and apply the rules of these languages to the match
		sub: 'a language name'
	},
	{
		// will be use one of the match from the common.js file
		extand: 'str'
	},
	{
		match: /script: .*/g,
		sub: [
			// inline sub language
		]
	}
]
//default color
export let type = "oper";
```
