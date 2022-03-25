import '../typedef.js'

/** @type {ShjLanguage[]} */
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

/** @type {ShjBrowserTheme[]} */
export const themesBrowser = [
	'default',
	'atom-dark',
	'github-dark',
	'github-dim',
	'dark',
	'github-light',
	'visual-studio-dark'
]

/** @type {ShjTerminalTheme[]} */
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
