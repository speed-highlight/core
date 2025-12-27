# Supported Languages

Speed Highlight supports 35 languages out of the box. Each language adds ~1kB to your bundle (loaded on demand).

## Language List

| Language | Class | Auto-Detection |
|----------|-------|----------------|
| Assembly | `shj-lang-asm` | ✅ |
| Bash | `shj-lang-bash` | ✅ |
| Brainfuck | `shj-lang-bf` | ❌ |
| C | `shj-lang-c` | ✅ |
| CSS | `shj-lang-css` | ✅ |
| CSV | `shj-lang-csv` | ❌ |
| Diff | `shj-lang-diff` | ✅ |
| Docker | `shj-lang-docker` | ✅ |
| Git | `shj-lang-git` | ❌ |
| Go | `shj-lang-go` | ✅ |
| HTML | `shj-lang-html` | ✅ |
| HTTP | `shj-lang-http` | ✅ |
| INI | `shj-lang-ini` | ❌ |
| Java | `shj-lang-java` | ✅ |
| JavaScript | `shj-lang-js` | ✅ |
| JSDoc | `shj-lang-jsdoc` | ❌ |
| JSON | `shj-lang-json` | ❌ |
| Leanpub Markdown | `shj-lang-leanpub-md` | ❌ |
| Log | `shj-lang-log` | ❌ |
| Lua | `shj-lang-lua` | ✅ |
| Makefile | `shj-lang-make` | ✅ |
| Markdown | `shj-lang-md` | ✅ |
| Perl | `shj-lang-pl` | ✅ |
| Plain Text | `shj-lang-plain` | ❌ |
| Python | `shj-lang-py` | ✅ |
| Regex | `shj-lang-regex` | ❌ |
| Rust | `shj-lang-rs` | ✅ |
| SQL | `shj-lang-sql` | ✅ |
| Todo | `shj-lang-todo` | ❌ |
| TOML | `shj-lang-toml` | ❌ |
| TypeScript | `shj-lang-ts` | ✅ |
| URI | `shj-lang-uri` | ✅ |
| XML | `shj-lang-xml` | ✅ |
| YAML | `shj-lang-yaml` | ❌ |

## Usage

```html
<div class="shj-lang-js">
const greeting = 'Hello, world!';
console.log(greeting);
</div>
```

## Auto-Detection

For languages marked with ✅, you can use automatic detection:

```js
import { detectLanguage } from '@speed-highlight/core/detect';

const lang = detectLanguage(code);
```

::: tip
Auto-detection works best with longer code snippets. Short snippets may be ambiguous between similar languages.
:::

## Adding Languages

Want to add support for a language that's not listed? See [Creating Languages](/creating-languages).

You can also [suggest new languages](https://github.com/speed-highlight/core/issues) by creating an issue.
