/**
 * @name HTML
 * @support inline style and event handlers
 */

import xml, { properties, xmlElement } from './xml.js';

let
	/**
	 * An attribute, given by a regex source, whose value is written in another language
	 * @type {(name: string, sub: string) => import('../index.js').ShjRule}
	 */
	attribute = (name, sub) => ({
		type: 'str',
		// the name is left to the attribute rule of xml, only its value differs
		match: RegExp(`(?<=\\s${name}\\s*)=\\s*('[^']*'|"[^"]*")`, 'gi'),
		sub: [
			{
				type: 'oper',
				match: /^=/g
			},
			{
				// the quotes are left to the rule's own type
				match: /(?<=['"])[^]+(?=['"]$)/g,
				sub
			}
		]
	}),
	htmlElement = {
		...xmlElement,
		sub: [
			attribute('style', 'css'),
			attribute('on\\w+', 'js'),
			...xmlElement.sub
		]
	};

export default /** @satisfies {import('../index.js').ShjGrammar} */ ([
	{
		type: 'class',
		match: /<!DOCTYPE("[^"]*"|'[^']*'|[^"'>])*>/gi,
		sub: [
			{
				type: 'str',
				match: /"[^"]*"|'[^']*'/g
			},
			{
				type: 'oper',
				match: /^<!|>$/g
			},
			{
				type: 'var',
				match: /DOCTYPE/gi
			}
		]
	},
	{
		match: RegExp(`<style${properties}>[^]*?</style\\s*>`, 'g'),
		sub: [
			{
				match: RegExp(`^<style${properties}>`, 'g'),
				sub: htmlElement.sub
			},
			{
				match: /[^]*(?=<\/style\s*>$)/g,
				sub: 'css'
			},
			htmlElement
		]
	},
	{
		match: RegExp(`<script${properties}>[^]*?</script\\s*>`, 'g'),
		sub: [
			{
				match: RegExp(`^<script${properties}>`, 'g'),
				sub: htmlElement.sub
			},
			{
				match: /[^]*(?=<\/script\s*>$)/g,
				sub: 'js'
			},
			htmlElement
		]
	},
	// the element rule is the only one html extends, the rest of xml is reused as is
	...xml.map(rule => rule === xmlElement ? htmlElement : rule)
]);
