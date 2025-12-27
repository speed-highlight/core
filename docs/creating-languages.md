# Creating Languages

[View existing languages](https://github.com/speed-highlight/core/tree/main/src/languages) · [View common patterns](https://github.com/speed-highlight/core/blob/main/src/common.js)

## Structure

A language is an array of match rules:

```js
export default [
	{ match: /\b(if|else|for)\b/g, type: 'kwd' },
	{ match: /"[^"]*"/g, type: 'str' },
];
```

## Match Rules

### Basic

```js
{ match: /\b(if|else|for|while)\b/g, type: 'kwd' }
```

### Extend Common Patterns

```js
{ extend: 'str' }  // reuses string matching from common.js
```

### Sub-languages

```js
{ match: /<script[^>]*>([\s\S]*?)<\/script>/g, sub: 'js' }
```

## Register at Runtime

```js
import { loadLanguage } from '@speed-highlight/core';

loadLanguage('mylang', [
	{ match: /hello/g, type: 'kwd' },
	{ extend: 'str' }
]);
```

## Extend Existing Languages

```js
import jsRules from './js.js';

export default [
	{ match: /\b(async|await)\b/g, type: 'kwd' },
	...jsRules
];
```

## Tips

- Order rules by priority (first match wins)
- Use global flag (`/g`) on all regexes
- See [Tokens Reference](/tokens) for available token types
