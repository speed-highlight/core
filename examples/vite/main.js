import { highlightAll } from '@speed-highlight/core';
import '@speed-highlight/core/themes/default.css';

// every element with a shj-lang-* class; a code element renders inline. vite
// splits each language into its own chunk, loaded only when a page uses it
highlightAll();
