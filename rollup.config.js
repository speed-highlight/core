import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy'


export default {
	plugins: [
		dynamicImportVars(), // Fix dynamics imports
		terser(), // Minify bundle
		copy({ // Copy d.ts files
			targets: [
				{ src: 'src/*.d.ts', dest: 'dist' }
			]
		})
	],
	input: [
		'src/index.js'
	],
	output: {
		dir: './dist',
    preserveModules: true
	}
};