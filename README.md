# speed-highlight.js

## Light

  * Base script 2.7kB + languages rules from 0.15kB to 1.2kB (not minified)
  * Language rules needed automatically loaded on the fly

## Fast

Up to **15x** times faster then highlight.js and **4x** times faster than prism.js

## No setup needed

In your html file
```html
<pre class='lang-[code-language]'>
	<code>
		<!-- code to be highlighted -->
	</code>
</pre>
```

In your javascript file
```js
import { setTheme, highlightAll } from 'https://unpkg.com/speed-highlight.js/index.js'
setTheme('https://unpkg.com/speed-highlight.js/themes/default.css');
highlightAll();
```

## Languages supported

| Name      | Class name | Support |
| --------  | ---------- | ------- |
| javascipt | lang-js    | basic syntax, regex, jsdoc, template literals |

## Create new languages

## Create new styles
