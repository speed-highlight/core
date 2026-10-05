// every example, read by the site and the tests, so neither keeps its own list:
// the site shows `files` in a tab named `label`, with the first of `run`; the
// tests render each `index.html` and run every command of `run` exactly as
// written here, and fail on a folder missing from this list

export default [
	{ dir: 'html', label: 'HTML', files: ['index.html'] },
	{ dir: 'vite', label: 'Vite', files: ['main.js', 'index.html'] },
	{ dir: 'react', label: 'React', files: ['Code.jsx', 'App.jsx'] },
	{ dir: 'vue', label: 'Vue', files: ['Code.vue', 'App.vue'] },
	{ dir: 'svelte', label: 'Svelte', files: ['Code.svelte', 'App.svelte'] },
	{ dir: 'angular', label: 'Angular', files: ['code.component.ts', 'app.component.ts', 'styles.css'] },
	// the commands run from the example's folder and print examples/languages/test.ts
	{ dir: 'node', label: 'Node', files: ['highlight.js'], run: ['node highlight.js ../languages/test.ts', 'node highlight.cjs ../languages/test.ts', 'node highlight.ts ../languages/test.ts'] },
	{ dir: 'deno', label: 'Deno', files: ['highlight.js'], run: ['deno run --allow-read highlight.js ../languages/test.ts'] },
];
