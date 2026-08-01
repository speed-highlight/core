import { highlightText } from '@speed-highlight/core';
import { Component, effect, input, signal } from '@angular/core';

// [innerHTML] is enough: angular's sanitizer keeps the class attribute, which is
// where all the colouring lives, so no bypassSecurityTrustHtml is needed.
//
// it is also safe for untrusted code: highlightText escapes &, < and > in every
// token before wrapping it (see sanitize in src/index.js), so the only markup in
// the result is the spans it added itself.

@Component({
	selector: 'shj-code',
	standalone: true,
	template: `<div [class]="'shj-lang-' + lang() + ' shj-' + (multiline() ? 'multi' : 'one') + 'line'" [innerHTML]="html()"></div>`
})
export class CodeComponent {
	code = input.required<string>();
	lang = input.required<string>();
	multiline = input(true);

	html = signal('');

	constructor() {
		effect(onCleanup => {
			let stale = false;

			highlightText(this.code(), this.lang(), this.multiline())
				.then(res => stale || this.html.set(res));

			// a slow language import can resolve after the inputs changed
			onCleanup(() => stale = true);
		});
	}
}

// <shj-code lang="js" [code]="'const a = 1;'" />
