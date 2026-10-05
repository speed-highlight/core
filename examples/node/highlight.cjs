const { readFileSync } = require('node:fs');
const { highlightANSI } = require('@speed-highlight/core');
const { default: theme } = require('@speed-highlight/core/themes/default.js');

// highlight.js in commonjs, which has no top-level await
const file = process.argv[2];

highlightANSI(readFileSync(file, 'utf8'), file.split('.').pop(), theme).then(console.log);
