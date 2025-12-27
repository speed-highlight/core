# Terminal Usage

Speed Highlight works in Node.js and Deno for terminal/CLI syntax highlighting using ANSI escape codes.

## Node.js

### Installation

```bash
npm i @speed-highlight/core
```

### Basic Usage

```js
import { setTheme, printHighlight } from '@speed-highlight/core/terminal';

// Set a theme (required before highlighting)
setTheme('default');

// Print highlighted code to stdout
printHighlight('console.log("hello")', 'js');
```

### Get Highlighted String

If you need the ANSI string without printing:

```js
import { setTheme, highlightText } from '@speed-highlight/core/terminal';

setTheme('default');
const highlighted = await highlightText('const x = 42;', 'js');
console.log(highlighted);
```

## Deno

Use the [Deno module](https://deno.land/x/speed_highlight_js):

```js
import { setTheme, printHighlight } from 'https://deno.land/x/speed_highlight_js/dist/terminal.js';

await setTheme('default');
printHighlight('console.log("hello")', 'js');
```

::: tip
In Deno, `setTheme` is async and must be awaited.
:::

## Terminal Themes

Available terminal themes:

| Theme | Name |
|-------|------|
| Default | `default` |
| Atom Dark | `atom-dark` |

```js
setTheme('atom-dark');
```

## Creating Terminal Themes

Terminal themes use ANSI escape codes. Create a theme object mapping token types to colors:

```js
// ANSI color codes
// black: \x1b[30m  red: \x1b[31m  green: \x1b[32m  yellow: \x1b[33m
// blue: \x1b[34m  magenta: \x1b[35m  cyan: \x1b[36m  white: \x1b[37m
// gray: \x1b[90m

export default {
  kwd: '\x1b[34m',    // keywords in blue
  str: '\x1b[32m',    // strings in green
  num: '\x1b[33m',    // numbers in yellow
  cmnt: '\x1b[90m',   // comments in gray
  // ... see tokens reference for all token types
};
```

See [Tokens Reference](/tokens) for the complete list of token types.

## Auto Language Detection

Tries to guess the language automatically:

```js
import { highlightText } from '@speed-highlight/core/terminal';
import { detectLanguage } from '@speed-highlight/core/detect';

const code = 'function hello() { return 42; }';
const lang = detectLanguage(code);
const highlighted = await highlightText(code, lang);
```
