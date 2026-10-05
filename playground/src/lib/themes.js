// bundled at build time so the playground works without runtime paths;
// themes come from dist where the @import on default.css is already
// resolved, the raw src files would lose the base rules when injected
const cssFiles = import.meta.glob('../../../dist/themes/*.css', { query: '?raw', import: 'default', eager: true });
// the terminal themes are token maps of a few bytes, bundled rather than
// loaded; termcolor.js is the helper they are written with, not a theme
const termFiles = import.meta.glob(['../../../src/themes/*.js', '!../../../src/themes/termcolor.js'], { import: 'default', eager: true });

const baseName = path => path.split('/').pop().replace(/\.\w+$/, '');
const themeOrder = (a, b) => (b === 'default') - (a === 'default') || a.localeCompare(b);

export const themeCss = Object.fromEntries(Object.entries(cssFiles).map(([path, css]) => [baseName(path), css]));

// every theme with a stylesheet; the ones that also ship a js token map
// work in the terminal, nothing to keep in sync by hand
export const terminalThemeMaps = Object.fromEntries(Object.entries(termFiles).map(([path, theme]) => [baseName(path), theme]));
export const terminalThemes = Object.keys(terminalThemeMaps).sort(themeOrder);

// each theme's real colors, parsed out of its bundled css, paint the
// little fake code block previews in the picker
export const themePreviews = Object.fromEntries(Object.entries(themeCss).map(([name, css]) => {
	const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)];
	// the bundled css inlines default.css first, so the theme's own
	// override is the last matching plain rule, like the cascade
	// resolves it; pseudo and descendant rules (::selection, the http
	// header) are not the token's base color
	const colorOf = (selector, property = 'color') => rules
		.findLast(([, sel, body]) =>
			sel.includes(selector) && body.includes(`${property}:`) && !sel.includes(':') && !sel.trim().includes(' '))?.[2]
		.match(new RegExp(`${property}:([^;]+)`))[1];
	return [name, {
		bg: colorOf('[class*=shj-lang-]', 'background'),
		text: colorOf('[class*=shj-lang-]'),
		kwd: colorOf('.shj-syn-kwd'),
		str: colorOf('.shj-syn-str'),
		cmnt: colorOf('.shj-syn-cmnt'),
		num: colorOf('.shj-syn-num'),
		func: colorOf('.shj-syn-func'),
	}];
}));

const luma = color => {
	const hex = color?.trim().match(/^#([0-9a-f]{3,8})$/i)?.[1];
	if (!hex)
		return 0;
	const full = hex.length < 6 ? [...hex].map(c => c + c).join('') : hex;
	const [r, g, b] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const isDarkTheme = name => luma(themePreviews[name].bg) <= 0.5;

// light/dark grouping derived from each theme's background luminance
const allThemes = Object.keys(themeCss).sort(themeOrder);
export const themeGroups = {
	light: allThemes.filter(name => !isDarkTheme(name)),
	dark: allThemes.filter(isDarkTheme),
};
export const themes = [...themeGroups.light, ...themeGroups.dark];

export const themeLabel = name => name.replace('visual-studio', 'vs');
