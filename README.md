# Speed Highlight JS

Light, fast, and easy to use, dependencies free javascript syntax highlighter, with automatic language detection, [try it out here](https://speed-highlight.github.io/core/examples/)

![](https://github.com/speed-highlight/core/blob/main/assets/screenshot.png)

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

Auto language detection
```js
import { highlightElement } from '../src/index.js';
import { detectLanguage } from '../src/detect.js';

elm.textContent = code;
highlightElement(elm, detectLanguage(code));
```

#### CDN

```js
import ... from 'https://unpkg.com/speed_highlight_js/dist/index.js'
import ... from 'https://cdn.jsdelivr.net/gh/matubu/speed_highlight_js/dist/index.js'
```

### Deno

Use the [Deno module](https://deno.land/x/speed_highlight_js)

```js
import { setTheme, printHighlight } from 'https://x.nest.land/speed_highlight_js/dist/term.js';

await setTheme('default');
printHighlight('console.log("hello")', 'js');
```

## Node

Use the [npm package](https://www.npmjs.com/package/speed_highlight_js)

```bash
npm install speed_highlight_js
```

```js
const { setTheme, printHighlight } = require('speed_highlight_js/dist/node/term.js');

setTheme('default')
  .then(() => printHighlight('console.log("hello")', 'js'));
```

## Languages supported 🌐

| Name       | Class name          | Support                                             | Language detection |
| ---------- | ------------------- | --------------------------------------------------- | ------------------ |
| bash       | shj-lang-bash       |                                                     | ✅                 |
| brainfuck  | shj-lang-bf         | increment, operator, print, comment                 | ❌                 |
| css        | shj-lang-css        | comment, str, selector, units, function, ...        | ✅                 |
| csv        | shj-lang-csv        | punctuation, ...                                    | ❌                 |
| diff       | shj-lang-diff       |                                                     | ✅                 |
| git        | shj-lang-git        | comment, insert, deleted, string, ...               | ❌                 |
| html       | shj-lang-html       |                                                     | ✅                 |
| http       | shj-lang-http       | keywork, string, punctuation, variable, version     | ✅                 |
| ini        | shj-lang-ini        |                                                     | ❌                 |
| javascipt  | shj-lang-js         | basic syntax, regex, jsdoc, json, template literals | ✅                 |
| jsdoc      | shj-lang-jsdoc      |                                                     | ❌                 |
| json       | shj-lang-json       | string, number, bool, ...                           | ❌                 |
| leanpub-md | shj-lang-leanpub-md |                                                     | ❌                 |
| log        | shj-lang-log        | number, string, comment, errors                     | ❌                 |
| lua        | shj-lang-lua        |                                                     | ✅                 |
| makefile   | shj-lang-make       |                                                     | ✅                 |
| markdown   | shj-lang-md         |                                                     | ✅                 |
| perl       | shj-lang-pl         |                                                     | ✅                 |
| plain      | shj-lang-plain      |                                                     | ❌                 |
| python     | shj-lang-py         |                                                     | ✅                 |
| regex      | shj-lang-regex      | count, set, ...                                     | ❌                 |
| sql        | shj-lang-sql        | number, string, function, ...                       | ✅                 |
| todo       | shj-lang-todo       |                                                     | ❌                 |
| toml       | shj-lang-toml       | comment, table, string, bool, variable              | ❌                 |
| typescript | shj-lang-ts         | js syntax, ts keyword, types                        | ✅                 |
| uri        | shj-lang-uri        |                                                     | ✅                 |
| yaml       | shj-lang-yaml       | comment, numbers, variable, string, bool            | ❌                 |
| docker     | shj-lang-docker     |                                                     | ✅                 |
| c          | shj-lang-c          |                                                     | ✅                 |
| xml        | shj-lang-xml        |                                                     | ✅                 |
| rust       | shj-lang-rs         |                                                     | ✅                 |
| go         | shj-lang-go         |                                                     | ✅                 |
| java       | shj-lang-java       |                                                     | ✅                 |
| asm        | shj-lang-asm        |                                                     | ✅                 |

## Themes 🌈

A modern theme by default

| Name                | Terminal | Web |
| ------------------- | -------- | --- |
| default             | ✅       | ✅  |
| github-dark         | ❌       | ✅  |
| github-light        | ❌       | ✅  |
| github-dim          | ❌       | ✅  |
| atom-dark           | ❌       | ✅  |
| visual-studio-dark  | ❌       | ✅  |

## Wiki 👀

Further in-depth documentation for the API and other topics is in our [Wiki](https://github.com/speed-highlight/core/wiki)

## License 📃

Shj is released under the Creative Commons Zero License. See our [LICENSE](https://github.com/speed-highlight/core/blob/main/LICENSE) file for details.
