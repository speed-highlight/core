# Speed Highlight JS

## Light

  * Base script **3kB** + languages rules from **0.15kB** to **1.2kB** (not minified)
  * Language rules needed automatically loaded on the fly

## Fast

Up to **15x** times faster then highlight.js and up to **3x** times faster than prism.js

## Simple setup

In your html file
```html
<pre class='sh-lang-[code-language]'><code><!-- code to be highlighted --></code></pre>
```

In your javascript file
```js
import { setTheme, highlightAll } from '/path/index.js'
setTheme('/path/themes/default.css');
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
