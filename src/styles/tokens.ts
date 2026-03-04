// Design token definitions — single source of truth for colors, themes, typography, and shadows.
// Run `pnpm generate-tokens` to regenerate src/styles/tokens.css from these definitions.

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

export const colors = {
	black: '#000000',
	gray: '#7e7e7e',
	grayLight: '#bebebe',
	white: '#ffffff',
	red: '#fe0000',
	redDark: '#7e0000',
	green: '#06ff04',
	greenDark: '#047e00',
	yellow: '#ffff04',
	yellowDark: '#7e7e00',
	blue: '#0000ff',
	blueDark: '#00007e',
	magenta: '#fe00ff',
	magentaDark: '#7e007e',
	cyan: '#06ffff',
	cyanDark: '#047e7e',
	windowsLeft: '#000080',
	windowsRight: '#1084d0',
} as const;

// ---------------------------------------------------------------------------
// Shadow constants (Win95 beveled chrome)
// ---------------------------------------------------------------------------

export const shadows = {
	offset: `inset -1px -1px ${colors.black}, inset 1px 1px ${colors.grayLight}, inset -2px -2px ${colors.gray}, inset 2px 2px ${colors.white}`,
	inset: `inset -1px -1px ${colors.white}, inset 1px 1px ${colors.gray}, inset -2px -2px ${colors.grayLight}, inset 2px 2px ${colors.black}`,
} as const;

// ---------------------------------------------------------------------------
// SVG data URIs
// ---------------------------------------------------------------------------

const fireSvg = `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M323.56 51.2c-20.8 19.3-39.58 39.59-56.22 59.97C240.08 73.62 206.28 35.53 168 0 69.74 91.17 0 209.96 0 281.6 0 408.85 100.29 512 224 512s224-103.15 224-230.4c0-53.27-51.98-163.14-124.44-230.4zM224 464c-97.05 0-176-81.83-176-182.4 0-45.37 44.3-133.21 120.16-214.09 22.34 23.36 42.82 47.72 60.34 71.86l36.62 50.44 39.41-48.29c5.83-7.15 11.85-14.15 18.01-20.97C368.89 177.96 400 250.42 400 281.6 400 382.17 321.05 464 224 464zm89.47-220.84l-51.3 58.52S181.75 198.98 175.69 192C133.27 242.86 112 272.62 112 306.41 112 374.23 163.37 416 226.5 416c25.26 0 48.62-7.87 67.58-21.13 43.08-30.14 53.18-88.58 29.26-134.24-2.95-5.62-6.24-11.48-9.87-17.47z" fill="%23fe0000"/></svg>')`;

// Win95-style select dropdown arrow SVG with themed colors
// Colors map: highlight (top-left edge), light (inner highlight), shadow (bottom-right + arrow), darkShadow (inner shadow), face (button background)
function selectArrowSvg(opts: {
	highlight: string;
	light: string;
	shadow: string;
	darkShadow: string;
	face: string;
}): string {
	const enc = (c: string) => encodeURIComponent(c);
	return `url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='${enc(opts.highlight)}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='${enc(opts.light)}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='${enc(opts.shadow)}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='${enc(opts.darkShadow)}'/%3E%3Cpath fill='${enc(opts.face)}' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='${enc(opts.shadow)}'/%3E%3C/svg%3E")`;
}

// ---------------------------------------------------------------------------
// Theme tokens
// ---------------------------------------------------------------------------

export const themeNames = ['dark', 'light', 'sanity', 'hotdog'] as const;

export type ThemeName = (typeof themeNames)[number];

const themeTokenKeys = [
	'color-background',
	'color-text',
	'color-a',
	'color-h1',
	'color-h2',
	'color-h3',
	'color-h4',
	'color-h5',
	'color-wallpaper',
	'color-post-meta',
	'font-normal',
	'font-h1',
	'font-h2',
	'font-h3',
	'font-h4',
	'font-h5',
	'font-comments',
	'window-font-title',
	'window-color-background-left',
	'window-color-background-right',
	'window-color-title-text',
	'window-color-border',
	'window-color-nav-background',
	'window-color-nav-text',
	'window-color-nav-separator',
	'window-color-nav-highlight',
	'select-arrow-image',
	'comment-form-background-color',
	'comment-form-submit-padding',
	'comment-form-submit-font-size',
	'comment-form-submit-background-color',
	'comment-single-background-color',
	'comment-single-avatar-border',
	'comment-single-date-color',
	'comment-single-author-color',
	'li-image',
] as const;

export type ThemeTokenKey = (typeof themeTokenKeys)[number];
export type ThemeTokens = Record<ThemeTokenKey, string>;

const baseTheme: ThemeTokens = {
	// Colors
	'color-background': colors.black,
	'color-text': colors.white,
	'color-a': colors.blue,
	'color-h1': colors.green,
	'color-h2': colors.magenta,
	'color-h3': colors.cyan,
	'color-h4': colors.yellow,
	'color-h5': colors.cyan,
	'color-wallpaper': colors.cyanDark,
	'color-post-meta': colors.gray,

	// Fonts
	'font-normal': "'Comic Neue'",
	'font-h1': "'Comic Neue'",
	'font-h2': "'Papyrus'",
	'font-h3': "'Comic Neue'",
	'font-h4': "'Tinos', 'Times New Roman', Times, serif",
	'font-h5': "'Tinos', 'Times New Roman', Times, serif",
	'font-comments': "'Tinos', 'Times New Roman', Times, serif",

	// Windows
	'window-font-title': "'Windows Regular', sans-serif",
	'window-color-background-left': colors.windowsLeft,
	'window-color-background-right': colors.windowsRight,
	'window-color-title-text': colors.white,
	'window-color-border': colors.grayLight,
	'window-color-nav-background': colors.grayLight,
	'window-color-nav-text': colors.black,
	'window-color-nav-separator': colors.gray,
	'window-color-nav-highlight': colors.white,
	'select-arrow-image': selectArrowSvg({
		highlight: colors.grayLight,
		light: colors.white,
		shadow: colors.black,
		darkShadow: colors.gray,
		face: '#c0c0c0',
	}),

	// Comments
	'comment-form-background-color': colors.grayLight,
	'comment-form-submit-padding': '3rem',
	'comment-form-submit-font-size': '3rem',
	'comment-form-submit-background-color': colors.cyan,
	'comment-single-background-color': colors.yellowDark,
	'comment-single-avatar-border': `2px solid ${colors.green}`,
	'comment-single-date-color': colors.magentaDark,
	'comment-single-author-color': colors.redDark,

	// List markers
	'li-image': fireSvg,
};

// Dark theme is identical to base — no overrides needed.
const darkOverrides: Partial<ThemeTokens> = {};

const lightOverrides: Partial<ThemeTokens> = {
	'color-background': colors.white,
	'color-text': colors.black,
	'color-a': colors.greenDark,
	'color-h1': colors.greenDark,
	'color-h2': colors.magentaDark,
	'color-h3': colors.cyanDark,
	'color-h4': colors.yellowDark,
	'color-h5': colors.cyanDark,
	'comment-form-submit-padding': '3rem',
	'comment-form-submit-font-size': '3rem',
	'comment-form-submit-background-color': colors.cyanDark,
	'comment-single-background-color': colors.yellowDark,
	'comment-single-avatar-border': `2px solid ${colors.green}`,
	'comment-single-date-color': colors.magentaDark,
	'comment-single-author-color': colors.redDark,
};

const sanityOverrides: Partial<ThemeTokens> = {
	'font-normal': 'sans-serif',
	'font-h1': 'sans-serif',
	'font-h2': 'sans-serif',
	'font-h3': 'sans-serif',
	'font-h4': 'sans-serif',
	'font-h5': 'sans-serif',
	'font-comments': 'sans-serif',
	'color-background': colors.white,
	'color-text': colors.black,
	'color-a': colors.blue,
	'color-h1': colors.black,
	'color-h2': colors.black,
	'color-h3': colors.black,
	'color-h4': colors.black,
	'color-h5': colors.black,
	'comment-form-submit-padding': '3rem',
	'comment-form-submit-font-size': '3rem',
	'comment-form-submit-background-color': colors.cyan,
	'comment-single-background-color': colors.yellowDark,
	'comment-single-avatar-border': `2px solid ${colors.green}`,
	'comment-single-date-color': colors.magentaDark,
	'comment-single-author-color': colors.redDark,
};

const hotdogOverrides: Partial<ThemeTokens> = {
	'color-background': colors.yellow,
	'color-text': colors.black,
	'color-a': colors.red,
	'color-h1': colors.red,
	'color-h2': colors.red,
	'color-h3': colors.red,
	'color-h4': colors.red,
	'color-h5': colors.red,
	'color-wallpaper': colors.red,
	'color-post-meta': colors.black,
	'window-color-background-left': colors.red,
	'window-color-background-right': colors.red,
	'window-color-border': colors.red,
	'window-color-nav-background': colors.white,
	'window-color-nav-text': colors.black,
	'window-color-nav-separator': colors.gray,
	'window-color-nav-highlight': colors.white,
	'select-arrow-image': selectArrowSvg({
		highlight: colors.white,
		light: colors.white,
		shadow: colors.red,
		darkShadow: colors.gray,
		face: colors.yellow,
	}),
	'comment-form-background-color': colors.yellow,
	'comment-form-submit-background-color': colors.yellow,
	'comment-single-background-color': colors.red,
	'comment-single-avatar-border': `2px solid ${colors.yellow}`,
	'comment-single-date-color': colors.white,
	'comment-single-author-color': colors.white,
	'li-image': fireSvg,
};

export const themes: Record<ThemeName, ThemeTokens> = {
	dark: { ...baseTheme, ...darkOverrides },
	light: { ...baseTheme, ...lightOverrides },
	sanity: { ...baseTheme, ...sanityOverrides },
	hotdog: { ...baseTheme, ...hotdogOverrides },
};

export { baseTheme };

// ---------------------------------------------------------------------------
// Customizable token definitions for the advanced theme panel
// ---------------------------------------------------------------------------

export type CustomizableToken = {
	key: ThemeTokenKey;
	label: string;
};

export type CustomizableTokenGroup = {
	id: string;
	label: string;
	type: 'color' | 'font';
	tokens: CustomizableToken[];
};

export const customizableTokenGroups: CustomizableTokenGroup[] = [
	{
		id: 'colors',
		label: 'Colors',
		type: 'color',
		tokens: [
			{ key: 'color-background', label: 'Background' },
			{ key: 'color-wallpaper', label: 'Wallpaper' },
			{ key: 'color-text', label: 'Text' },
			{ key: 'color-a', label: 'Links' },
			{ key: 'color-h1', label: 'Heading 1' },
			{ key: 'color-h2', label: 'Heading 2' },
			{ key: 'color-h3', label: 'Heading 3' },
			{ key: 'color-h4', label: 'Heading 4' },
			{ key: 'color-h5', label: 'Heading 5' },
			{ key: 'color-post-meta', label: 'Post Meta' },
		],
	},
	{
		id: 'windowColors',
		label: 'Window',
		type: 'color',
		tokens: [
			{ key: 'window-color-background-left', label: 'Title Bar Left' },
			{ key: 'window-color-background-right', label: 'Title Bar Right' },
			{ key: 'window-color-title-text', label: 'Title Text' },
			{ key: 'window-color-border', label: 'Border' },
			{ key: 'window-color-nav-background', label: 'Nav Background' },
			{ key: 'window-color-nav-text', label: 'Nav Text' },
		],
	},
	{
		id: 'fonts',
		label: 'Fonts',
		type: 'font',
		tokens: [
			{ key: 'font-normal', label: 'Body' },
			{ key: 'font-h1', label: 'Heading 1' },
			{ key: 'font-h2', label: 'Heading 2' },
			{ key: 'font-h3', label: 'Heading 3' },
			{ key: 'font-h4', label: 'Heading 4' },
			{ key: 'font-h5', label: 'Heading 5' },
			{ key: 'font-comments', label: 'Comments' },
		],
	},
];

export const fontOptions = [
	{ value: "'Comic Neue'", label: 'Comic Neue' },
	{ value: "'Papyrus'", label: 'Papyrus' },
	{ value: "'Tinos', 'Times New Roman', Times, serif", label: 'Tinos' },
	{ value: "'Windows Regular', sans-serif", label: 'Windows Regular' },
	{ value: 'sans-serif', label: 'Sans Serif' },
	{ value: 'serif', label: 'Serif' },
	{ value: 'monospace', label: 'Monospace' },
	{ value: 'cursive', label: 'Cursive' },
] as const;

// ---------------------------------------------------------------------------
// Fluid typography computation
// ---------------------------------------------------------------------------

function round(value: number, places: number): number {
	const factor = 10 ** places;
	return Math.round(value * factor) / factor;
}

function toRems(px: number): number {
	return px / 16;
}

function computeClamp(minPx: number, maxPx: number, minBp: number = 0, maxBp: number = 1400): string {
	const slope = (maxPx - minPx) / (maxBp - minBp);
	const slopeVw = round(slope * 100, 2);
	const interceptRems = round(toRems(minPx - slope * minBp), 2);
	const minRems = round(toRems(minPx), 2);
	const maxRems = round(toRems(maxPx), 2);
	return `clamp(${minRems}rem, ${slopeVw}vw + ${interceptRems}rem, ${maxRems}rem)`;
}

export type FluidTypeStep = 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

const typeSteps: FluidTypeStep[] = ['sm', 'base', 'md', 'lg', 'xl', 'xxl', 'xxxl'];
const typeBase = 16;
const typeScale = 1.2;
const typeBaseIndex = typeSteps.indexOf('base');

export function computeFluidType(): Record<FluidTypeStep, string> {
	const result = {} as Record<FluidTypeStep, string>;
	for (let i = 0; i < typeSteps.length; i++) {
		const step = typeSteps[i];
		const min = typeBase * typeScale ** (i - typeBaseIndex);
		const max = typeBase * typeScale ** (i - typeBaseIndex + 1);
		result[step] = computeClamp(min, max);
	}
	return result;
}
