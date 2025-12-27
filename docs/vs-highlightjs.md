# Speed Highlight vs highlight.js

Speed Highlight is a lighter alternative to highlight.js focused on simplicity and size.

## Comparison

| Feature | Speed Highlight | highlight.js |
|---------|-----------------|--------------|
| Core size | ~2 kB | ~40 kB |
| Per-language | ~1 kB | ~2-10 kB |
| Dependencies | 0 | 0 |
| Performance | Faster | Standard |
| Languages | 35 | 190+ |
| Auto-detection | Yes | Yes |
| TypeScript | Built-in types | @types/highlight.js |
| Terminal support | Built-in | Separate package |

## When to Use Speed Highlight

- **Bundle size is priority** - 20x smaller core
- **Performance matters** - faster tokenization
- **Terminal highlighting** - built-in, no extra package
- **Common languages only** - JS, TS, Python, Rust, Go, HTML, CSS, etc.

## When to Stay with highlight.js

- **You need many languages** - highlight.js has 190+
- **Existing integration** - already set up
- **Specific themes** - highlight.js has 90+ themes

## Migration Guide

### 1. Replace the Stylesheet

```diff
<head>
-  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.x/styles/default.min.css">
+  <link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
</head>
```

### 2. Replace the Script

```diff
-<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.x/highlight.min.js"></script>
-<script>hljs.highlightAll();</script>
+<script type="module">
+  import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
+  highlightAll();
+</script>
```

### 3. Update Code Block Classes

Replace `language-` prefix with `shj-lang-`:

```diff
-<pre><code class="language-javascript">
+<div class="shj-lang-js">
const x = 42;
-</code></pre>
+</div>
```

### 4. Update JavaScript API Calls

```diff
-hljs.highlight(code, { language: 'javascript' }).value
+await highlightText(code, 'js')
```

```diff
-hljs.highlightElement(element)
+highlightElement(element)
```

```diff
-hljs.highlightAuto(code).language
+detectLanguage(code)
```

## Class Name Mapping

| highlight.js | Speed Highlight |
|--------------|-----------------|
| `language-javascript` | `shj-lang-js` |
| `language-typescript` | `shj-lang-ts` |
| `language-python` | `shj-lang-py` |
| `language-rust` | `shj-lang-rs` |
| `language-*` | `shj-lang-*` |

See [Languages](/languages) for the full list.

## API Equivalents

| highlight.js | Speed Highlight |
|--------------|-----------------|
| `hljs.highlightAll()` | `highlightAll()` |
| `hljs.highlightElement(el)` | `highlightElement(el)` |
| `hljs.highlight(code, {language})` | `highlightText(code, lang)` |
| `hljs.highlightAuto(code)` | `detectLanguage(code)` |
| `hljs.registerLanguage()` | `loadLanguage()` |
