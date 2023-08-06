/**
 * Try to find the language the given code belong to
 * @param code The code
 * @returns The language of the code
 */
export declare function detectLanguage(
  code: string
): Promise<import('.').ShjLanguage>