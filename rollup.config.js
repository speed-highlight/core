import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import { terser } from "rollup-plugin-terser";

export default {
	plugins: [
		dynamicImportVars(), // Fix dynamics imports
		terser() // Minify bundle
	],
	input: [
		'src/index.js'
	],
	output: {
		dir: './dist',
    preserveModules: true
	}
};