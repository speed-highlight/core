# Vite example

```console
$ npm i @speed-highlight/core
$ npx vite
```

`main.js` imports the library and a theme, then highlights every element of
`index.html` with a `shj-lang-*` class. No config is needed: vite follows the
library's lazy language imports and emits one small chunk per language.
