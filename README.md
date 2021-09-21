# Speed Highlight JS

## Light

  * Base script **3kB** + languages rules from **0.15kB** to **1.2kB** (not minified)
  * Language rules needed automatically loaded on the fly

## Fast


## Simple setup

In the header of your html file
```html
<link rel="stylesheet" href="/path/themes/default.css">
```

In the body of your html file
```html
<div class='sh-lang-[code-language]'>[code]</div>
or
<code class='sh-lang-[code-language]'>[inline code]</code>
```

In your javascript file
```js
import { setTheme, highlightAll } from '/path/index.js'
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

| Name                |
| ------------------- |
| default             |
| github-dark         |
| github-light        |
| github-dim          |
| atom-dark           |
| visual-studio-dark  |

## Create new languages

## Create new styles