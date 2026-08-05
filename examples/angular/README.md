# Angular example

```console
$ npm i @speed-highlight/core
```

`code.component.ts` wraps the highlighter as a standalone component:

```html
<shj-code lang="js" [code]="'const a = 1;'" />
```

No `bypassSecurityTrustHtml` is needed — angular's sanitizer keeps the `class`
attribute, which is the only thing the themes rely on.

The component renders the string `highlightText` returns instead of calling
`highlightElement` on a mounted node — angular owns that node and would wipe the
spans on its next render. It also drops a result that arrives after its inputs
changed, since `highlightText` is async while it imports the language.

Injecting that html is safe even for code you did not write: every token is
escaped before it is wrapped, so the only markup left is the library's own spans.
