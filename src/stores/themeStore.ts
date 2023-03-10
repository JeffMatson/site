import { persistentAtom } from '@nanostores/persistent';
import { BooleanAsString, ThemeName } from '../types';

export type PaletteStoreValue = '' | undefined;

function getPreferredTheme(): ThemeName {
    if ( window && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }

    return 'dark';
}

const themeStore = persistentAtom<ThemeName>('theme', getPreferredTheme());
const paletteStore = persistentAtom<PaletteStoreValue>('palette', undefined);

// I should really just loop this. It's fine now, but it's gonna get annoying.
themeStore.subscribe(val => {
    const themeName = ThemeName.parse(val);
    const root = document.documentElement;
    
    const themeOptions = ['light', 'dark', 'sanity', 'hotdog'];
	if ( themeName && themeOptions.includes(themeName) ) {
        for ( const themeOption of themeOptions ) {
            root.classList.remove(themeOption);
            if ( themeOption === themeName ) {
                root.classList.add(themeName);
            }
        }
	}
});

function getPrefersReducedMotion(): BooleanAsString {
    if (window && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

export {
    prefersReducedMotionStore,
    themeStore,
    setTheme,
    setPalette,
    getTheme,
    getPalette,
};