/**
 * @name HTML
 * @support inline style and event handlers
 */

import xml, { attributes, name, xmlElement } from './xml.js';

let
	// html is looser than xml: an attribute name is anything but whitespace,
	// quotes, `>`, `/` and `=`, which is how framework templates write
	// `[prop]`, `(event)`, `@event`, `:prop` or `{prop}`
	attribute = `[^\\s"'>\\/=]+`,
	properties = attributes(attribute),
	/**
	 * An attribute, given by a regex source, whose value is written in another language
	 * @type {(name: string, sub: string) => import('../index.js').ShjRule}
	 */
	attributeIn = (name, sub) => ({
		type: 'str',
		// the name is left to the attribute name rule below, only its value differs
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
	/** @type {{ match: RegExp, sub: import('../index.js').ShjGrammar }} */
	htmlElement = {
		match: RegExp(`<[\/!?]?${name}${properties}[\/!?]?>`, 'g'),
		sub: [
			attributeIn('style', 'css'),
			attributeIn('on\\w+', 'js'),
			// the attribute names of xml are swapped for the looser ones
			...xmlElement.sub.slice(0, -1),
			{
				type: 'class',
				match: RegExp(attribute, 'g')
			}
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
