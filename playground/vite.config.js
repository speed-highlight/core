import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { defineConfig } from 'vite';

// what the site says about the library, read from it at build time so it
// cannot drift: the core size of the build it ships, the description and
// dependencies of its package.json, the @name each grammar declares (the
// README's language table reads the same)
const read = file => readFileSync(new URL(`../${file}`, import.meta.url));
const pkg = JSON.parse(read('package.json'));
const library = {
	coreGzip: gzipSync(read('dist/index.js')).length,
	description: pkg.description,
	dependencies: Object.keys(pkg.dependencies ?? {}).length,
	languageNames: Object.fromEntries(readdirSync(new URL('../src/languages/', import.meta.url))
		.filter(file => file !== 'index.js')
		.map(file => [file.replace(/\.js$/, ''), String(read(`src/languages/${file}`)).match(/@name\s+(.+)/)[1].trim()])),
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			// every page is prerendered into dist/, the folder the pages workflow publishes
			adapter: adapter({ pages: 'dist' }),
			// `await` in components: the prerendered page waits for the highlighting,
			// so it holds the highlighted code, not a placeholder
			compilerOptions: { experimental: { async: true } },
		}),
	],
	define: {
		__LIBRARY__: JSON.stringify(library),
	},
	build: {
		// keep the icon set as files instead of inlining hundreds of
		// data urls into the bundle, only rendered icons get fetched
		assetsInlineLimit: 0,
	},
	server: {
		fs: { allow: ['..'] },
	},
});
