import { languages, themesTerminal } from './data.js'
import { setTheme, printHighlight, highlightText } from '../src/terminal.js';
import { fromFileUrl } from 'https://deno.land/std/path/mod.ts';
import { parse } from "https://deno.land/std/flags/mod.ts"

let args = parse(Deno.args)

if (args.help)
{
	console.log(`Usage deno run --allow-read deno.js [OPTION]... [TEST_FILE]`)
	console.log(``)
	console.log(`    --help              display this help and exit`)
	console.log(`    --theme=[-]THEME    change the used THEME`)
	console.log(`    --lang=[-]LANGUAGE  change the used LANGUAGE`)
	console.log(`    --stdin             highlight code given from the stdin`)
	console.log(``)
	console.log(`THEME may be:`)
	console.log(`${themesTerminal.join(', ')}`)
	console.log(`LANGUAGE may be:`)
	console.log(`${languages.join(', ')}`)
	Deno.exit(0)
}

if (args.theme)
{
	if (!themesTerminal.includes(args.theme))
	{
		console.error(`'${args.theme}' is not a supported try on of the following theme:`)
		console.log(`${themesTerminal.join(', ')}`)
		Deno.exit(1)
	}
	await setTheme(args.theme)
}

if (args.lang && !languages.includes(args.lang))
{
	console.error(`'${args.lang}' is not a supported try on of the following languages:`)
	console.log(`${languages.join(', ')}`)
	Deno.exit(1)
}

let code;
let language;

if (args.stdin)
{
	code = await new Response(Deno.stdin.readable).text();
	language = args.lang ?? 'js';
} else {
	const absolutePath = args._[0] ?? fromFileUrl(import.meta.url.replace(/[^\\\/]+$/, './languages/test.js'))
		.replace(Deno.cwd(), '')
		.slice(1)

	code = await Deno.readTextFile(absolutePath);
	language = args.lang ?? args._[0]?.split?.('.')?.[1] ?? 'js';
}

await printHighlight(code, language);

console.time('highlight')
for (let i = 0; i < 100; i++) {
	await highlightText(code, language);
}
console.timeEnd('highlight')
