import { highlightText } from '@speed-highlight/core';
import '@speed-highlight/core/themes/default.css';
import { useEffect, useState } from 'react';

// the highlighted code is html, so render it with dangerouslySetInnerHTML rather
// than highlighting the dom node imperatively: react owns that node and would
// overwrite the spans on its next render.
//
// this is safe for untrusted code: highlightText escapes &, < and > in every
// token before wrapping it (see sanitize in src/index.js), so the only markup
// in the result is the spans it added itself.

export default function Code({ code, lang, multiline = true, ...props }) {
	let [html, setHtml] = useState('');

	useEffect(() => {
		let stale = false;

		highlightText(code, lang, multiline)
			.then(res => stale || setHtml(res));

		// a slow language import can resolve after the props changed
		return () => stale = true;
	}, [code, lang, multiline]);

	return <div
		className={`shj-lang-${lang} shj-${multiline ? 'multi' : 'one'}line`}
		dangerouslySetInnerHTML={{ __html: html }}
		{...props} />;
}

// <Code lang='js' code={'const a = 1;'} />
