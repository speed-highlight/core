# Speed Highlight vs Prism

Speed Highlight is a lighter, faster alternative to Prism with a similar API.

## Comparison

| Feature | Speed Highlight | Prism |
|---------|-----------------|-------|
| Core size | ~2 kB | ~17 kB |
| Per-language | ~1 kB | ~1-5 kB |
| Dependencies | 0 | 0 |
| Performance | Faster (see benchmarks) | Standard |
| Languages | 35 | 290+ |
| Plugins | None (core features built-in) | Many |
| TypeScript | Built-in types | @types/prismjs |

## When to Use Speed Highlight

- **Bundle size matters** - significantly smaller core
- **Performance is critical** - faster tokenization
- **You need common languages** - JS, TS, Python, Rust, Go, etc.
- **Terminal highlighting** - built-in terminal support

## When to Stay with Prism

- **You need 100+ languages** - Prism has more
- **Plugin ecosystem** - line numbers, copy button, etc. (Speed Highlight has some built-in)
- **Existing integration** - already deeply integrated

## Migration Guide

### 1. Replace the Stylesheet

```diff
<head>
-  <link href="themes/prism.css" rel="stylesheet" />
+  <link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
</head>
```

### 2. Replace the Script

```diff
<body>
-  <script src="prism.js"></script>
+  <script type="module">
+    import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
+    highlightAll();
+  </script>
</body>
```

### 3. Update Code Block Classes

Replace `language-` prefix with `shj-lang-`:

```diff
-<pre><code class="language-css">p { color: red }</code></pre>
+<div class="shj-lang-css">p { color: red }</div>
```

For inline code:

```diff
-<code class="language-css">color: red</code>
+<code class="shj-lang-css">color: red</code>
```

### 4. Update JavaScript API Calls

If using Prism's API:

```diff
-Prism.highlight(code, Prism.languages.javascript, 'javascript')
+await highlightText(code, 'js')
```

```diff
-Prism.highlightElement(element)
+highlightElement(element)
```

## Class Name Mapping

| Prism | Speed Highlight |
|-------|-----------------|
| `language-javascript` | `shj-lang-js` |
| `language-typescript` | `shj-lang-ts` |
| `language-python` | `shj-lang-py` |
| `language-rust` | `shj-lang-rs` |
| `language-*` | `shj-lang-*` |

See [Languages](/languages) for the full list.

## Feature Equivalents

| Prism Feature | Speed Highlight |
|---------------|-----------------|
| Line numbers plugin | Built-in (multiline mode) |
| Auto-highlight | `highlightAll()` |
| Manual highlight | `highlightElement()` |
| Language detection | `detectLanguage()` |
