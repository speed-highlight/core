import md from './md.js'
import { detectLanguage } from '../detect.js'

export default [
	{
		type: 'insert',
		match: /(leanpub-start-insert)((?!leanpub-end-insert)[^])*(leanpub-end-insert)?/g,
		sub: [
			{
				type: 'insert',
				match: /leanpub-(start|end)-insert/g
			},
			{
				match: /(?!leanpub-start-insert)((?!leanpub-end-insert)[^])*/g,
				sub: detectLanguage
			}
		]
	},
	{
		type: 'deleted',
		match: /(leanpub-start-delete)((?!leanpub-end-delete)[^])*(leanpub-end-delete)?/g,
		sub: [
			{
				type: 'deleted',
				match: /leanpub-(start|end)-delete/g
			},
			{
				match: /(?!leanpub-start-delete)((?!leanpub-end-delete)[^])*/g,
				sub: detectLanguage
			}
		]
	},
	...md
]
