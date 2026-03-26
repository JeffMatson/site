import { persistentAtom } from '@nanostores/persistent';
import { themeNames } from '../styles/tokens';
import { type BooleanAsString, ThemeName } from '../types';

export type PaletteStoreValue = '' | undefined;

function getPreferredTheme(): ThemeName {
	if (window?.matchMedia('(prefers-color-scheme: light)').matches) {
		return 'light';
	}

	return 'dark';
}

const themeStore = persistentAtom<ThemeName>('theme', getPreferredTheme());
const paletteStore = persistentAtom<PaletteStoreValue>('palette', undefined);

// I should really just loop this. It's fine now, but it's gonna get annoying.
themeStore.subscribe((val) => {
	if (typeof document === 'undefined') return;
	const parsed = ThemeName.safeParse(val);
	if (!parsed.success) {
		themeStore.set(getPreferredTheme());
		return;
	}
	const root = document.documentElement;

	for (const themeOption of themeNames) {
		root.classList.remove(themeOption);
	}
	root.classList.add(parsed.data);
});

function getPrefersReducedMotion(): BooleanAsString {
	if (window?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return 'true';
	}

	return 'false';
}
const prefersReducedMotionStore = persistentAtom<BooleanAsString>('reducedMotion', getPrefersReducedMotion());

function setTheme(theme: ThemeName) {
	themeStore.set(theme);
}

function getTheme(): ThemeName {
	return themeStore.get();
}

function setPalette(palette: PaletteStoreValue) {
	paletteStore.set(palette);
}

function getPalette(): PaletteStoreValue {
	return paletteStore.get();
}

export { getPalette, getTheme, prefersReducedMotionStore, setPalette, setTheme, themeStore };
