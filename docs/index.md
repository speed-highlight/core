# Quickstart

Speed Highlight is a light, fast, and dependency-free JavaScript syntax highlighter for web and terminal.

## Installation

```bash
npm i @speed-highlight/core
```

Or use via CDN (no install needed):
```
https://unpkg.com/@speed-highlight/core/dist/index.js
```

## Web (Browser)

**1. Add a theme**

```html
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
```

**2. Mark your code blocks**

```html
<div class="shj-lang-js">console.log('Hello')</div>
```

**3. Highlight**

```html
<script type="module">
  import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
  highlightAll();
</script>
```

With npm/bundler:

```js
import { highlightAll } from '@speed-highlight/core';
highlightAll();
```

→ [Full Web Guide](/web)

## Terminal (Node.js / Deno)

**Node.js**

```js
import { setTheme, printHighlight } from '@speed-highlight/core/terminal';

setTheme('default');
printHighlight('console.log("hello")', 'js');
```

**Deno**

```js
import { setTheme, printHighlight } from 'https://deno.land/x/speed_highlight_js/dist/terminal.js';

await setTheme('default');
printHighlight('console.log("hello")', 'js');
```

→ [Full Terminal Guide](/terminal)

## Next Steps

- [API Reference](/api) - All functions documented
- [Themes](/themes) - Available color themes
- [Languages](/languages) - Supported languages
- [Demo](/demo) - Interactive playground
