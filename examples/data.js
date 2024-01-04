/** @type {import('../src/index.js').ShjLanguage[]} */
export const languages = [
	'js',
	'py',
	'bash',
	'ts',
	'c',
	'css',
	'asm',
	'csv',
	'diff',
	'docker',
	'git',
	'go',
	'html',
	'http',
	'ini',
	'java',
	'jsdoc',
	'json',
	'leanpub-md',
	'bf',
	'log',
	'lua',
	'make',
	'md',
	'pl',
	'plain',
	'regex',
	'rs',
	'sql',
	'todo',
	'toml',
	'uri',
	'xml',
	'yaml'
]

/** @type {import('../src/index.js').ShjBrowserTheme[]} */
export const themesBrowser = [
	'default',
	'atom-dark',
	'github-dark',
	'github-dim',
	'dark',
	'github-light',
	'visual-studio-dark'
]

/** @type {import('../src/terminal.js').ShjTerminalTheme[]} */
export const themesTerminal = [
	'default',
	'atom-dark'
]

export const testFiles = [
	...languages,
	'oneline.bash',
	'oneline.http',
	'screenshot.js'
]
