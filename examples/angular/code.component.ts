import { highlightHTML } from '@speed-highlight/core';
import { Component, effect, input, signal } from '@angular/core';

// [innerHTML] is enough, angular's sanitizer keeps the classes the themes use.
// Safe for any code, every token is escaped

@Component({
	selector: 'shj-code',
	template: `<div [class]="'shj-lang-' + lang() + ' shj-' + (block() ? 'block' : 'inline')" [innerHTML]="html()"></div>`
})
export class CodeComponent {
	code = input.required<string>();
	lang = input.required<string>();
	block = input(true);
	showLineNumbers = input(false);

	html = signal('');

	constructor() {
		effect(onCleanup => {
			let stale = false;

			highlightHTML(this.code(), this.lang(), { block: this.block(), showLineNumbers: this.showLineNumbers() })
				.then(res => stale || this.html.set(res));

			// a slow language import can resolve after the inputs changed
			onCleanup(() => stale = true);
		});
	}
}
