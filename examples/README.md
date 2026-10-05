# Examples

Each folder is a small working use of the library, listed in
[`manifest.js`](manifest.js). That list is the only one: the
[site](https://speed-highlight.github.io) shows the files it names, and
[`tests/examples`](../tests/examples) builds, renders and runs every entry on
each pull request. An example added to the manifest is shown and tested with
nothing else to update.

## Components

[React](react), [Vue](vue), [Svelte](svelte) and [Angular](angular) each have
a `Code` component and an `App` using it. A component renders the string
`highlightHTML` returns rather than calling `highlightElement` on its own
node: the framework owns that node and would wipe the spans on its next
render. It also drops a result that arrives after its inputs changed, since
`highlightHTML` is async while it imports the language.

Injecting that html is safe even for code you did not write: every token is
escaped before it is wrapped, so the only markup in it is the library's spans.

## Pages and terminals

- [html](html): no build step, the library and a theme from the CDN
- [vite](vite): the same page bundled, one small chunk per language
- [node](node), [deno](deno): a file highlighted for the terminal, in node
  also with CommonJS and TypeScript
