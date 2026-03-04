import { persistentAtom } from '@nanostores/persistent';
import type { ThemeTokenKey } from '../styles/tokens';
import { themeNames } from '../styles/tokens';
import { BooleanAsString, ThemeName } from '../types';

export type PaletteStoreValue = '' | undefined;

function getPreferredTheme(): ThemeName {
	if (window?.matchMedia('(prefers-color-scheme: light)').matches) {
		return 'light';
	}

	return 'dark';
}

const themeStore = persistentAtom<ThemeName>('theme', getPreferredTheme());
const paletteStore = persistentAtom<PaletteStoreValue>('palette', undefined);
const advancedModeStore = persistentAtom<BooleanAsString>('advancedMode', 'false');
const advancedOverridesStore = persistentAtom<string>('advancedOverrides', '{}');

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

function applyAdvancedOverrides() {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;

	// Clear all inline custom properties we may have set
	for (let i = root.style.length - 1; i >= 0; i--) {
		const prop = root.style[i];
		if (prop.startsWith('--')) {
			root.style.removeProperty(prop);
		}
	}

	const isAdvanced = advancedModeStore.get() === 'true';
	if (!isAdvanced) return;

	let overrides: Record<string, string>;
	try {
		overrides = JSON.parse(advancedOverridesStore.get() || '{}');
	} catch {
		return;
	}

	for (const [key, value] of Object.entries(overrides)) {
		if (typeof value === 'string') {
			root.style.setProperty(`--${key}`, value);
		}
	}
}

advancedModeStore.subscribe((val) => {
	const parsed = BooleanAsString.safeParse(val);
	if (!parsed.success) {
		advancedModeStore.set('false');
		return;
	}
	applyAdvancedOverrides();
});

advancedOverridesStore.subscribe(() => {
	applyAdvancedOverrides();
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

function setAdvancedMode(mode: BooleanAsString) {
	advancedModeStore.set(mode);
}

function getAdvancedOverrides(): Partial<Record<ThemeTokenKey, string>> {
	try {
		return JSON.parse(advancedOverridesStore.get() || '{}');
	} catch {
		return {};
	}
}

function setAdvancedOverride(key: ThemeTokenKey, value: string) {
	const overrides = getAdvancedOverrides();
	advancedOverridesStore.set(JSON.stringify({ ...overrides, [key]: value }));
}

function removeAdvancedOverride(key: ThemeTokenKey) {
	const overrides = getAdvancedOverrides();
	const next = { ...overrides };
	delete next[key];
	advancedOverridesStore.set(JSON.stringify(next));
}

function resetAdvancedOverrides() {
	advancedOverridesStore.set('{}');
}

export {
	advancedModeStore,
	advancedOverridesStore,
	getAdvancedOverrides,
	getPalette,
	getTheme,
	prefersReducedMotionStore,
	removeAdvancedOverride,
	resetAdvancedOverrides,
	setAdvancedMode,
	setAdvancedOverride,
	setPalette,
	setTheme,
	themeStore,
};
