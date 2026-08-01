# Frameworks

One `Code` component per framework. Copy the file into your project, import the theme
css once, and use it.

```
React.jsx            react 19
Code.svelte          svelte 5 (a note in the file covers svelte 4)
Code.vue             vue 3
code.component.ts    angular 22
```

```html
<link rel="stylesheet" href="/node_modules/@speed-highlight/core/dist/themes/default.css">
```

## Why they all look the same

Every one of them renders the string from `highlightText` rather than calling
`highlightElement` on a mounted node. A framework owns the dom it rendered — highlight
the node imperatively and the next render wipes the spans out.

They all guard the same race too: `highlightText` is async because it imports the
language, so a component whose props change before the import resolves would otherwise
paint the previous language's output.

## Is the html safe to inject?

Yes, including for code you did not write. `highlightText` escapes `&`, `<` and `>` in
every token before wrapping it (`sanitize` in `src/index.js`), so the only markup left in
the result is the spans the library added.

Angular needs no `bypassSecurityTrustHtml`: its sanitizer keeps the `class` attribute,
which is the only thing the themes rely on.

## Bundlers

Nothing to configure. Vite resolves the ``import(`./languages/${lang}.js`)`` inside the
library by itself and emits every language into the build — checked on a vite 8
production build, not just on the dev server.
