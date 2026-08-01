# Speed Highlight JS

<p align="center">
	<a href="https://speed-highlight.github.io/core/examples">Demo</a> |
	<a href="https://github.com/speed-highlight/core/wiki">Wiki</a> |
	<a href="https://speed-highlight.github.io/core/docs">Docs</a>
</p>

![Screenshot](https://raw.githubusercontent.com/speed-highlight/core/main/assets/screenshot.png)

- 🪶 Lightweight (**~2kB** for the core + **~1kB** by language)
- ⚡ Fast (faster than prism and highlight.js on average)
- 🧹 Minimal Codebase

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
import { highlightAll } from '/path/dist/index.js';
highlightAll();
```

Auto language detection

```js
import { highlightElement } from '../dist/index.js';
import { detectLanguage } from '../dist/detect.js';

elm.textContent = code;
highlightElement(elm, detectLanguage(code));
```

Load custom language

```js
import { loadLanguage } from '../dist/index.js';

loadLanguage('language-name', customLanguage);
```

---

#### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/speed-highlight/core/dist/themes/default.css">
```

```js
import ... from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
import ... from 'https://cdn.jsdelivr.net/gh/speed-highlight/core/dist/index.js';
```

---

### Deno

Use the [deno module](https://deno.land/x/speed_highlight_js)

```js
import { setTheme, printHighlight } from 'https://deno.land/x/speed_highlight_js/dist/terminal.js';

await setTheme('[theme-name]');
printHighlight('console.log("hello")', 'js');
```

---

### Node

Use the [npm package](https://www.npmjs.com/package/@speed-highlight/core)

```bash
npm i @speed-highlight/core
```

```js
const { setTheme, printHighlight } = require('@speed-highlight/core/terminal');

setTheme('[theme-name]');
printHighlight('console.log("hello")', 'js');
```

## Migrating from prism

Speed-highlight JS is a lighter and faster version of prism that share a similar API

### Style

Remove the prism stylesheet in the head of your html file
Clone this repository or use a cdn to load our stylesheet

```diff
<head>
-  <link href="themes/prism.css" rel="stylesheet" />
+  <link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
</head>
```

### Script

For the script part remove the prism.js script and replace it by a import and a call to `highlightAll`

```diff
<body>
-  <script src="prism.js"></script>
+<script>
+  import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
+  highlightAll();
+</script>
</body>
```

If you want to highlight only a specific element you can use the `highlightElement` function instead

### Code block

For the code blocks replace the `<pre><code>` by only one `<div>`
And use `shj-lang-` prefix instead of `language-` for the class property

```diff
-<pre><code class="language-css">p { color: red }</code></pre>
+<div class="shj-lang-css">p { color: red }</div>
```

And for inline code block you just have to change the class property

```diff
-<code class="language-css">p { color: red }</code>
+<code class="shj-lang-css">p { color: red }</code>
```

## Languages supported 🌐

| Name       | Class name          | Support                                             | Language detection |
| ---------- | ------------------- | --------------------------------------------------- | ------------------ |
| asm        | shj-lang-asm        |                                                     | ✅                 |
| bash       | shj-lang-bash       |                                                     | ✅                 |
| brainfuck  | shj-lang-bf         | increment, operator, print, comment                 | ❌                 |
| c          | shj-lang-c          |                                                     | ✅                 |
| c#         | shj-lang-cs         |                                                     | ✅                 |
| c++        | shj-lang-cpp        |                                                     | ✅                 |
| cobol      | shj-lang-cobol      |                                                     | ✅                 |
| css        | shj-lang-css        | comment, str, selector, units, function, ...        | ✅                 |
| csv        | shj-lang-csv        | punctuation, ...                                    | ❌                 |
| diff       | shj-lang-diff       |                                                     | ✅                 |
| docker     | shj-lang-docker     |                                                     | ✅                 |
| gdscript   | shj-lang-gd         |                                                     | ❌                 |
| git        | shj-lang-git        | comment, insert, deleted, string, ...               | ❌                 |
| go         | shj-lang-go         |                                                     | ✅                 |
| html       | shj-lang-html       |                                                     | ✅                 |
| http       | shj-lang-http       | keywork, string, punctuation, variable, version     | ✅                 |
| ini        | shj-lang-ini        |                                                     | ❌                 |
| java       | shj-lang-java       |                                                     | ✅                 |
| javascipt  | shj-lang-js         | basic syntax, regex, jsdoc, json, template literals | ✅                 |
| jsdoc      | shj-lang-jsdoc      |                                                     | ❌                 |
| json       | shj-lang-json       | string, number, bool, ...                           | ❌                 |
| leanpub-md | shj-lang-leanpub-md |                                                     | ❌                 |
| log        | shj-lang-log        | number, string, comment, errors                     | ❌                 |
| lua        | shj-lang-lua        |                                                     | ✅                 |
| makefile   | shj-lang-make       |                                                     | ✅                 |
| markdown   | shj-lang-md         |                                                     | ✅                 |
| mongodb    | shj-lang-mongodb    |                                                     | ❌                 |
| perl       | shj-lang-pl         |                                                     | ✅                 |
| php        | shj-lang-php        |                                                     | ✅                 |
| plain      | shj-lang-plain      |                                                     | ❌                 |
| python     | shj-lang-py         |                                                     | ✅                 |
| regex      | shj-lang-regex      | count, set, ...                                     | ❌                 |
| rust       | shj-lang-rs         |                                                     | ✅                 |
| sql        | shj-lang-sql        | number, string, function, ...                       | ✅                 |
| todo       | shj-lang-todo       |                                                     | ❌                 |
| toml       | shj-lang-toml       | comment, table, string, bool, variable              | ❌                 |
| typescript | shj-lang-ts         | js syntax, ts keyword, types                        | ✅                 |
| uri        | shj-lang-uri        |                                                     | ✅                 |
| xml        | shj-lang-xml        |                                                     | ✅                 |
| yaml       | shj-lang-yaml       | comment, numbers, variable, string, bool            | ❌                 |

## Themes 🌈

A modern theme by default

| Name                | Terminal | Web |
| ------------------- | -------- | --- |
| default             | ✅       | ✅  |
| github-dark         | ❌       | ✅  |
| github-light        | ❌       | ✅  |
| github-dim          | ❌       | ✅  |
| atom-dark           | ✅       | ✅  |
| visual-studio-dark  | ❌       | ✅  |
