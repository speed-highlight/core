# Tokens Reference

[View common.js source](https://github.com/speed-highlight/core/blob/main/src/common.js)

## Token Types

| Token | CSS Class | Description |
|-------|-----------|-------------|
| `kwd` | `.shj-syn-kwd` | Keywords (`if`, `else`, `function`) |
| `str` | `.shj-syn-str` | Strings |
| `num` | `.shj-syn-num` | Numbers |
| `cmnt` | `.shj-syn-cmnt` | Comments |
| `func` | `.shj-syn-func` | Function names |
| `type` | `.shj-syn-type` | Types |
| `class` | `.shj-syn-class` | Class names |
| `var` | `.shj-syn-var` | Variables |
| `oper` | `.shj-syn-oper` | Operators |
| `bool` | `.shj-syn-bool` | Booleans |
| `esc` | `.shj-syn-esc` | Escape characters |
| `section` | `.shj-syn-section` | Section delimiters |
| `insert` | `.shj-syn-insert` | Inserted (diffs) |
| `deleted` | `.shj-syn-deleted` | Deleted (diffs) |
| `err` | `.shj-syn-err` | Errors |

## In Language Definitions

```js
{ match: /\b(const|let|var)\b/g, type: 'kwd' }
```

## In CSS Themes

```css
.shj-syn-kwd { color: #ff7b72; }
.shj-syn-str { color: #a5d6ff; }
```

## In Terminal Themes

```js
export default {
	kwd: '\x1b[34m',  // blue
	str: '\x1b[32m',  // green
};
```

### ANSI Colors

| Color | Code | Bright |
|-------|------|--------|
| Black | `\x1b[30m` | `\x1b[90m` |
| Red | `\x1b[31m` | `\x1b[91m` |
| Green | `\x1b[32m` | `\x1b[92m` |
| Yellow | `\x1b[33m` | `\x1b[93m` |
| Blue | `\x1b[34m` | `\x1b[94m` |
| Magenta | `\x1b[35m` | `\x1b[95m` |
| Cyan | `\x1b[36m` | `\x1b[96m` |
| White | `\x1b[37m` | `\x1b[97m` |
