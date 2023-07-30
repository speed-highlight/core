/**
 * Highlight a string passed as argument and return a string that can directly be printed
 * @param src The code
 * @param ang The language of the code
 * @returns The highlighted string
 */
export declare function highlightText<T extends string = import('.').ShjLanguage>(
  src: string,
  lang: T
): Promise<string>;

/**
 * Highlight and print a given string
 * @param src The code
 * @param lang The language of the code
 */
export declare function printHighlight<T extends string = import('.').ShjLanguage>(
  src: string,
  lang: T
): Promise<void>;

/**
 * Change the current used theme for highlighting
 * @param name The name of the theme
 */
export declare function setTheme(name: import('.').ShjBrowserTheme): Promise<void>;