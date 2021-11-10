import md from './md.js'
import { detectLanguage } from '../detect.js'

export default [
	{
		match: /(leanpub-start-insert)((?!leanpub-end-insert)[^])*(leanpub-end-insert)?/g,
		type: 'insert',
		sub: [
			{
				match: /leanpub-(start|end)-insert/g,
				type: 'insert'
			},
			{
				match: /(?!leanpub-start-insert)((?!leanpub-end-insert)[^])*/g,
				sub: detectLanguage
			}
		]
	},
	{
		match: /(leanpub-start-delete)((?!leanpub-end-delete)[^])*(leanpub-end-delete)?/g,
		type: 'deleted',
		sub: [
			{
				match: /leanpub-(start|end)-delete/g,
				type: 'deleted'
			},
			{
				match: /(?!leanpub-start-delete)((?!leanpub-end-delete)[^])*/g,
				sub: detectLanguage
			}
		]
	},
	...md
]
