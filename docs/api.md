# API Reference

## Browser API

[View source](https://github.com/speed-highlight/core/blob/main/src/index.js)

```js
import { highlightAll, highlightElement, highlightText, loadLanguage, tokenize } from '@speed-highlight/core';
```

### highlightAll()

Highlights all elements with a `shj-lang-*` class.

### highlightElement(element, language?, mode?, options?)

Highlights a specific DOM element.

| Parameter | Type | Description |
|-----------|------|-------------|
| `element` | `HTMLElement` | Element to highlight |
| `language` | `string` | Language (e.g., `'js'`). Auto-detected from class if omitted. |
| `mode` | `'multiline' \| 'oneline' \| 'inline'` | Display mode. Auto-detected if omitted. |
| `options.hideLineNumbers` | `boolean` | Hide line numbers (default: `false`) |

### highlightText(code, language) → Promise\<string\>

Returns highlighted HTML string.

### loadLanguage(name, definition)

Registers a custom language. See [Creating Languages](/creating-languages).

### tokenize(code, language) → Promise\<array\>

Tokenizes code without generating HTML. Returns `[content, token_type]` tuples.

---

## Detection API

[View source](https://github.com/speed-highlight/core/blob/main/src/detect.js)

```js
import { detectLanguage } from '@speed-highlight/core/detect';
```

### detectLanguage(code) → string

Tries to guess the language of a code snippet.

---

## Terminal API

[View source](https://github.com/speed-highlight/core/blob/main/src/terminal.js)

```js
import { setTheme, printHighlight, highlightText } from '@speed-highlight/core/terminal';
```

### setTheme(name)

Sets the terminal color theme. Must be called before highlighting.

### printHighlight(code, language)

Prints highlighted code to stdout.

### highlightText(code, language) → Promise\<string\>

Returns ANSI-colored string.
