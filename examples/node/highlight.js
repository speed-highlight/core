import { highlightANSI } from '@speed-highlight/core';
import theme from '@speed-highlight/core/themes/default.js';
import { readFile } from 'node:fs/promises';

// the language is the file's extension
const file = process.argv[2];
const code = await readFile(file, 'utf8');

console.log(await highlightANSI(code, file.split('.').pop(), theme));
