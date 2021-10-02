import { setTheme, printHighlight } from '../src/deno.js';
import { fromFileUrl } from 'https://deno.land/std/path/mod.ts';

const lang = Deno.args[0] ?? 'js';

const path = fromFileUrl(import.meta.url.replace(/[^\\\/]+$/, `languages/test.${lang}`))
	.replace(Deno.cwd(), '')
	.slice(1)

const code = await Deno.readTextFile(path);

await setTheme('default');

printHighlight(code, lang, false);