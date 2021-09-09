# speed-highlight.js

## Light

  * Base script 2.7kB + languages rules from 150B to 1.2kB (not minified)
  * Language rules needed automatically loaded on the fly

## Fast

Up to **15x** times faster then highlight.js and **4x** times faster than prism.js

## Super simple to set up

In your javascript file
```js
import { highlightAll } from 'https://unpkg.com/speed-highlight.js/index.js'
highlightAll();
```
In your html file
```html
<!-- css theme file -->
<link rel="stylesheet" href="https://unpkg.com/speed-highlight.js/themes/default.css">

<pre class='lang-[code-language]'>
	<code>
		<!-- code to be highlighted -->
	</code>
</pre>
```

## Languages supported

| Name      | Class name | Support |
| --------  | ---------- | ------- |
| javascipt | lang-js    | basic syntax, regex, jsdoc, template literals |

## Create new languages

## Create new styles
