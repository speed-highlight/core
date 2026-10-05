import { highlightANSI } from 'npm:@speed-highlight/core';
import theme from 'npm:@speed-highlight/core/themes/default.js';

// the language is the file's extension
const file = Deno.args[0];
const code = await Deno.readTextFile(file);

console.log(await highlightANSI(code, file.split('.').pop(), theme));
