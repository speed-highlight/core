# Svelte example

```console
$ npm i @speed-highlight/core
```

`Code.svelte` wraps the highlighter as a component. It is written for svelte 5;
a comment in the file gives the svelte 4 form.

```svelte
<Code lang='js' code={'const a = 1;'} />
```

The component renders the string `highlightText` returns instead of calling
`highlightElement` on a mounted node — svelte owns that node and would wipe the
spans on its next render. It also drops a result that arrives after its inputs
changed, since `highlightText` is async while it imports the language.

Injecting that html is safe even for code you did not write: every token is
escaped before it is wrapped, so the only markup left is the library's own spans.
