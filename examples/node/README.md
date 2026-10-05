# Node example

```console
$ npm i @speed-highlight/core
$ node highlight.js ../languages/test.ts
```

`highlight.js` prints a file highlighted for the terminal, the language taken
from its extension. [`highlight.cjs`](highlight.cjs) is the same in CommonJS,
[`highlight.ts`](highlight.ts) in TypeScript, both run the same way.

`highlightANSI` needs a theme, imported from `themes/*.js`: `default` and
`atom-dark` ship with the library, and a theme is just a token-to-escape map
you can write yourself.
