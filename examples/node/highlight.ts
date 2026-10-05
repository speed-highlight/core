import { highlightANSI, type ShjLanguage } from '@speed-highlight/core';
import theme from '@speed-highlight/core/themes/default.js';
import { readFile } from 'node:fs/promises';

// highlight.js in typescript, node runs it as is
const file = process.argv[2];
const code = await readFile(file, 'utf8');

console.log(await highlightANSI(code, file.split('.').pop() as ShjLanguage, theme));
