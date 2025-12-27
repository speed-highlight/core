# Web Usage

Speed Highlight works in any browser environment. You can use it via CDN or install it with npm/your bundler.

## Installation

### CDN (Quick Start)

No build step required. Add to your HTML:

```html
<!-- Theme -->
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
```

```js
// JavaScript
import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
```

Alternative CDN:
```
https://cdn.jsdelivr.net/gh/speed-highlight/core/dist/themes/default.css
https://cdn.jsdelivr.net/gh/speed-highlight/core/dist/index.js
```

### npm / Bundler

```bash
npm i @speed-highlight/core
```

```js
import { highlightAll } from '@speed-highlight/core';
```

For themes, import the CSS in your bundler or include it in your HTML:
```css
@import '@speed-highlight/core/dist/themes/default.css';
```

## Basic Usage

### 1. Add a theme stylesheet

```html
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
```

### 2. Mark your code blocks

Use the `shj-lang-[language]` class:

```html
<!-- Block code -->
<div class="shj-lang-js">
function hello() {
  console.log('Hello, world!');
}
</div>

<!-- Inline code -->
<code class="shj-lang-js">const x = 42;</code>
```

### 3. Highlight

```html
<script type="module">
  import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
  highlightAll();
</script>
```

## Display Modes

Speed Highlight supports three display modes:

| Mode | Class Added | Use Case |
|------|-------------|----------|
| `multiline` | `shj-multiline` | Block code with line numbers (default for `<div>`) |
| `oneline` | `shj-oneline` | Single line block |
| `inline` | `shj-inline` | Inline code (default for `<code>`) |

The mode is detected automatically based on the element type, or you can specify it:

```js
highlightElement(element, 'js', 'multiline');
```

### Header Mode

Add the `shj-mode-header` class to show a header with the language name:

```html
<div class="shj-lang-js shj-mode-header">
console.log('hello');
</div>
```

## Highlighting Specific Elements

Use `highlightElement` for more control:

```js
import { highlightElement } from '@speed-highlight/core';

const element = document.querySelector('#my-code');
highlightElement(element, 'js');
```

With options:

```js
highlightElement(element, 'js', 'multiline', {
  hideLineNumbers: true
});
```

## Auto Language Detection

Tries to guess the language automatically:

```js
import { highlightElement } from '@speed-highlight/core';
import { detectLanguage } from '@speed-highlight/core/detect';

const code = element.textContent;
const language = detectLanguage(code);
highlightElement(element, language);
```

## Highlighting Text Directly

Get HTML string without modifying the DOM:

```js
import { highlightText } from '@speed-highlight/core';

const html = await highlightText('console.log("hello")', 'js');
// Returns: '<span class="shj-syn-...">...</span>'
```

## Loading Custom Languages

Register a custom language:

```js
import { loadLanguage } from '@speed-highlight/core';

loadLanguage('mylang', [
  { match: /keyword/g, type: 'kwd' },
  { extend: 'str' }
]);
```

See [Creating Languages](/creating-languages) for the full guide.
