# Speed Highlight JS

Light, fast, and easy to use syntax highlighter

![](https://github.com/matubu/speed_highlight_js/blob/main/assets/screenshot.png)

## Light 📦

 * The core is about **1kB** (gzipped & minified)
 * Languages definition are from **a few bytes** to **1kB**
 * Themes are about **1kB**
 * Language rules needed are automatically loaded

## Fast ⚡


## Simple setup 🚀

### Web

Style/theme (in the header of your html file):
```html
<link rel="stylesheet" href="/path/dist/themes/default.css">
```

In the body of your html file:
```html
<div class='shj-lang-[code-language]'>[code]</div>
or
<code class='shj-lang-[code-language]'>[inline code]</code>
```

Highlight the code (in your javascript):
```js
import { highlightAll } from '/path/dist/index.js'
highlightAll();
```

### Deno

```js
import { setTheme, printHighlight } from 'https://x.nest.land/speed_highlight_js/dist/deno.js';

await setTheme('default');
printHighlight('code', 'js', false);
```

## Languages supported 🌐

| Name       | Class name    | Support                                             |
| ---------- | ------------- | -------                                             |
| javascipt  | shj-lang-js    | basic syntax, regex, jsdoc, json, template literals |
| regex      | shj-lang-regex | count, set, ...                                     |
| sql        | shj-lang-sql   | number, string, function, ...                       |
| csv        | shj-lang-csv   | punctuation, ...                                    |
| git        | shj-lang-git   | comment, insert, deleted, string, ...               |
| plain      | shj-lang-plain |                                                     |
| toml       | shj-lang-toml  | comment, table, string, bool, variable              |
| yaml       | shj-lang-yaml  | comment, numbers, variable, string, bool            |
| http       | shj-lang-http  | keywork, string, punctuation, variable, version     |
| log        | shj-lang-log   | number, string, comment, errors                     |
| json       | shj-lang-json  | string, number, bool, ...                           |
| css        | shj-lang-css   | comment, str, selector, units, function, ...        |
| brainfuck  | shj-lang-bf    | increment, operator, print, comment                 |
| typescript | shj-lang-ts    | js syntax, ts keyword, types                        |

### Tokens

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

### Create new languages

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

## Themes ✨

A modern theme by default

| Name                |
| ------------------- |
| default             |
| github-dark         |
| github-light        |
| github-dim          |
| atom-dark           |
| visual-studio-dark  |

### Create new theme/styles

In your css file you can import the default styling,
then useful things to change can be:
```css
/* token style */
.shj-syn-[token-name] {color...}
/* line numbering style */
.shj-numbers {color...}
/* inline mode style */
code[class*="shj-lang-"] {...}
/* multiline mode style */
[class*="shj-lang-"]:not(code) {...}
/* both */
[class*="shj-lang-"] {default color, background...}
/* header with language name */
[class*="shj-lang-"]:not(code):before {...}
```

## License 📃

Shj is released under the Creative Commons Zero License. See our [LICENSE](https://github.com/matubu/shj/blob/main/LICENSE) file for details.
