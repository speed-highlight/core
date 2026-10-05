# Plain HTML example

No build step: `index.html` loads the library and a theme from the CDN.

Mark code with a `shj-lang-*` class and call `highlightAll` once. A `code`
element is highlighted inline, anything else as a block:

```html
<div class="shj-lang-js">console.log('hello');</div>
```

With a bundler, `npm i @speed-highlight/core` and import from
`@speed-highlight/core` and `@speed-highlight/core/themes/default.css` instead.
