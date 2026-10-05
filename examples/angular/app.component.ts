import { Component } from '@angular/core';
import { CodeComponent } from './code.component';

@Component({
	selector: 'app-root',
	imports: [CodeComponent],
	template: `
		<shj-code lang="js" [code]="code" [showLineNumbers]="true" />
		<shj-code lang="js" code="const a = 1;" [block]="false" />
	`
})
export class AppComponent {
	code = `const tag = '<b>' + "&";\nconsole.log(tag);`;
}
