# Interactive Demo

<script setup>
import Demo from './.vitepress/theme/components/Demo.vue';
</script>

<Demo />

## Try It Yourself

### CDN Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
</head>
<body>
  <div class="shj-lang-js">
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
  </div>

  <script type="module">
    import { highlightAll } from 'https://unpkg.com/@speed-highlight/core/dist/index.js';
    highlightAll();
  </script>
</body>
</html>
```

### Terminal Quick Start

```bash
npm i @speed-highlight/core
```

```js
import { setTheme, printHighlight } from '@speed-highlight/core/terminal';

setTheme('default');
printHighlight(`
function greet(name) {
  return \`Hello, \${name}!\`;
}
`, 'js');
```
