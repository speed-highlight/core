# Styling Guide

[View default theme source](https://github.com/speed-highlight/core/blob/main/src/themes/default.css)

## Main Container

```css
[class*="shj-lang-"] {
	color: #c9d1d9;
	background: #0d1117;
	font-family: 'Fira Code', monospace;
}
```

## Token Colors

Each token has a class `shj-syn-[token]`:

```css
.shj-syn-kwd { color: #ff7b72; }   /* keywords */
.shj-syn-str { color: #a5d6ff; }   /* strings */
.shj-syn-num { color: #79c0ff; }   /* numbers */
.shj-syn-cmnt { color: #8b949e; }  /* comments */
.shj-syn-func { color: #d2a8ff; }  /* functions */
.shj-syn-type { color: #ffa657; }  /* types */
```

See [Tokens Reference](/tokens) for the complete list.

## Display Modes

```css
.shj-inline { padding: 2px 6px; }
.shj-oneline { padding: 12px 16px; }
.shj-multiline { padding: 16px; }
```

## Line Numbers

```css
.shj-numbers {
	color: #6e7681;
	padding-right: 16px;
	user-select: none;
}
```

## Header Mode

When using `shj-mode-header` class:

```css
.shj-multiline.shj-mode-header::before {
	content: attr(data-lang);
	display: block;
	color: #58a6ff;
}
```
