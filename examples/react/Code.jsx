import { highlightHTML } from '@speed-highlight/core';
import '@speed-highlight/core/themes/default.css';
import { useEffect, useState } from 'react';

// renders the highlighted string: react owns the node, highlighting it in place
// would be undone on the next render. Safe for any code, every token is escaped

export default function Code({ code, lang, block = true, showLineNumbers = false, ...props }) {
	let [html, setHtml] = useState('');

	useEffect(() => {
		let stale = false;

		highlightHTML(code, lang, { block, showLineNumbers })
			.then(res => stale || setHtml(res));

		// a slow language import can resolve after the props changed
		return () => stale = true;
	}, [code, lang, block, showLineNumbers]);

	return <div
		className={`shj-lang-${lang} shj-${block ? 'block' : 'inline'}`}
		dangerouslySetInnerHTML={{ __html: html }}
		{...props} />;
}
