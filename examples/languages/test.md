Heading
=======

Sub-heading
-----------

Paragraphs are separated
by a blank line.

Two spaces at the end of a line
produce a line break.

 Text attributes _italic_,
**bold**, `monospace`. Some `console.log(lst.filter(e => e == true))` implementations may use *single-asterisks* for italic text.

Horizontal rule:

---

```
<link rel="stylesheet" href="style.css">
<link rel="favicon">
```

```js
for (let y = 0; y <= size; y++) {
  console.log(state.map(star => (star ? '*' : ' ')).join(''));
  state = state.map((_, i, arr) => arr[i + 1] || arr[i - 1]);
}
```

```beurihiuerh
}
```

Strikethrough:
~~strikethrough~~

Bullet list:

  * apples
  * oranges
  * pears

Numbered list:

  1. lather
  2. rinse
  3. repeat

An [example](http://example.com).

![Image](Icon-pictures.png "icon")

> Markdown uses email-style
> characters for blockquoting.
> Multiple paragraphs need to be prepended individually.

| Item         | Price     | # In stock |
|--------------|-----------|------------|
| Juicy Apples | 1.99      | *7*        |
| Bananas      | **1.89**  | 5234       |
