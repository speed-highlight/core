/////////// typedef.js ///////////

/**
 * Supported languages.
 */
export type ShjLanguage = 'asm'|'bash'|'bf'|'c'|'css'|'csv'|'diff'|'docker'|'git'|'go'|'html'|'http'|'ini'|'java'|'js'|'jsdoc'|'json'|'leanpub-md'|'log'|'lua'|'make'|'md'|'pl'|'plain'|'py'|'regex'|'rs'|'sql'|'todo'|'toml'|'ts'|'uri'|'xml'|'yaml';

/**
 * Themes supported in the browser.
 */
export type ShjBrowserTheme = 'atom-dark'|'github-dark'|'github-dim'|'dark'|'default'|'github-light'|'visual-studio-dark';

/**
 * Languages supported in the terminal.
 */
export type ShjTerminalTheme = 'default'|'atom-dark';

/**
 * * `inline` inside `code` element
 * * `oneline` inside `div` element and containing only one line
 * * `multiline` inside `div` element
 */
export type ShjDisplayMode = 'inline'|'oneline'|'multiline';

export type ShjToken = 'deleted'|'err'|'var'|'section'|'kwd'|'class'|'cmnt'|'insert'|'type'|'func'|'bool'|'num'|'oper'|'str'|'esc';

export interface ShjOptions {
  /**
   * Indicates whether to hide line numbers.
   * @default false
   */
  hideLineNumbers: boolean;
}

/////////// Custom Types ///////////

export type ShjLanguageComponent =
	| { type: string; match: RegExp }
	| { extand: string }
	| {
			match: RegExp;
			sub:
				| string
				| ((code: string) => { type: string; sub: Array<{ match: RegExp; sub: string }> });
	  };

export type ShjLanguageDefinition = Array<ShjLanguageComponent>;

/////////// index.js ///////////

/**
 * Find the tokens in the given code and call the callback
 * @param src The code
 * @param lang The language of the code
 * @param callback The callback function
 * this function will be given
 * * the text of the token
 * * the type of the token
 */
export declare function tokenize<T extends string = ShjLanguage>(
  src: string,
  lang: T,
  callback: (value: string, token: ShjToken) => void
): Promise<void>;

/**
 * Highlight a string passed as argument and return it
 * @example
 * elm.innerHTML = await highlightText(code, 'js');
 * @param src The code
 * @param lang The language of the code
 * @param multiline If it is multiline, it will add a wrapper for the line numbering and header
 * @param Customization options
 * @returns The highlighted string
 */
export declare function highlightText<T extends string = ShjLanguage>(
  src: string, 
  lang: T, 
  multiline?: boolean,
  opt?: ShjOptions
): Promise<string>;

/**
 * Highlight a DOM element by getting the new innerHTML with highlightText
 * @param elm The DOM element
 * @param lang The language of the code (seaching by default on `elm` for a 'shj-lang-' class)
 * @param mode The display mode (guessed by default)
 * @param opt Customization options
 */
export declare function highlightElement<T extends string = ShjLanguage>(
  elm: Element,
  lang?: T,
  mode?: ShjDisplayMode, 
  opt?: ShjOptions
): Promise<void>;

/**
 * Call highlightElement on element with a css class starting with `shj-lang-`
 * @param opt Customization options
 */
export declare function HighlightAll(opt?: ShjOptions): Promise<void>;

/**
 * Load a language and add it to the langs object
 * @param name The name of the language
 * @param module Module that has the language as the default export
 */
export declare function loadLanguage(
  name: string, 
  module: { default: ShjLanguageDefinition }
): void;