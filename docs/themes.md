# Themes

Speed Highlight includes several built-in themes. Import the CSS file for your chosen theme.

## Available Themes

| Theme | Terminal | Web |
|-------|----------|-----|
| Default | ✅ `default` | ✅ `default.css` |
| GitHub Dark | ❌ | ✅ `github-dark.css` |
| GitHub Light | ❌ | ✅ `github-light.css` |
| GitHub Dim | ❌ | ✅ `github-dim.css` |
| Atom Dark | ✅ `atom-dark` | ✅ `atom-dark.css` |
| Visual Studio Dark | ❌ | ✅ `visual-studio-dark.css` |

## Using a Theme (Web)

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/default.css">
```

Other themes:
```html
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/github-dark.css">
<link rel="stylesheet" href="https://unpkg.com/@speed-highlight/core/dist/themes/atom-dark.css">
```

### npm / Bundler

```css
@import '@speed-highlight/core/dist/themes/default.css';
```

Or reference directly in HTML:
```html
<link rel="stylesheet" href="./node_modules/@speed-highlight/core/dist/themes/default.css">
```

## Using a Theme (Terminal)

```js
import { setTheme } from '@speed-highlight/core/terminal';

setTheme('default');
// or
setTheme('atom-dark');
```

## Custom Themes

See [Styling Guide](/styling) to create your own theme or customize existing ones.
