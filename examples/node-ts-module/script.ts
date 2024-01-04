import { printHighlight, setTheme, ShjLanguage } from "@speed-highlight/core/terminal";
import { readFile } from "fs/promises";

const lang: ShjLanguage = process.argv[2] as ShjLanguage ?? 'js';
const code = await readFile(`../languages/test.${lang}`, "utf-8");

await setTheme("default");
await printHighlight(code, lang);
