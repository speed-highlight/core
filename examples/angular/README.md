# Angular example

```console
$ npm i @speed-highlight/core
```

[`code.component.ts`](code.component.ts) is the component,
[`app.component.ts`](app.component.ts) uses it. Why it renders the highlighted
string, and why that is safe: [the examples](../README.md#components).

`[innerHTML]` needs no `bypassSecurityTrustHtml`: angular's sanitizer keeps
the `class` attribute, the only thing the themes rely on.

The theme is global css, so it goes in the app's `src/styles.css`, as in
[`styles.css`](styles.css), not in the component: angular scopes a
component's own styles, they would not reach the html it injects.
