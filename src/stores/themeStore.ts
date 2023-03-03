import { persistentAtom } from '@nanostores/persistent';
import type { BooleanAsString } from '../types';

export type ThemeStoreValue = 'light' | 'dark' | 'sanity' | undefined;

function getPreferredTheme(): ThemeStoreValue {
    if ( ! window ) {
        return 'dark';
    }

    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }

    return 'dark';
}

const themeStore = persistentAtom<ThemeStoreValue>('theme', getPreferredTheme());
themeStore.subscribe(val => {
    const root = document.documentElement;
    if (val === 'light') {
        root.classList.remove('dark');
        root.classList.remove('sanity');
        root.classList.add('light');
    } else if (val === 'dark') {
        root.classList.remove('light');
        root.classList.remove('sanity');
        root.classList.add('dark');
    } else if ( val === 'sanity' ) {
        root.classList.remove('dark');
        root.classList.remove('light');
        root.classList.add('sanity');
    } else {
        const prefers = getPreferredTheme();
    }
});

function getPrefersReducedMotion(): BooleanAsString {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'true';
    }

    return 'false';
}
const prefersReducedMotionStore = persistentAtom<BooleanAsString>('reducedMotion', getPrefersReducedMotion());

function setTheme(theme: ThemeStoreValue) {
    themeStore.set(theme);
}

function getTheme(): ThemeStoreValue {
    return themeStore.get();
}

export {
    prefersReducedMotionStore,
    themeStore,
    setTheme,
    getTheme,
};