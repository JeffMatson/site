import { beforeEach, describe, expect, test } from 'vitest';
import { setTestStorageKey, useTestStorageEngine } from '@nanostores/persistent';
import { themeNames } from '../../src/styles/tokens';

// Replace happy-dom's localStorage proxy with a plain object
// so @nanostores/persistent can write to it via property assignment.
useTestStorageEngine();

const { getTheme, getPalette, setTheme, setPalette, themeStore } = await import('../../src/stores/themeStore');

beforeEach(() => {
	// Toggle themes to guarantee the subscriber fires (nanostores
	// skips notification when oldValue === newValue) and classList is updated.
	setTheme('light');
	setTheme('dark');
});

describe('themeStore', () => {
	test('has a valid default theme', () => {
		expect(themeNames).toContain(getTheme());
	});

	test('setTheme updates the current theme', () => {
		setTheme('light');
		expect(getTheme()).toBe('light');
	});

	test('can cycle through all themes', () => {
		for (const name of themeNames) {
			setTheme(name);
			expect(getTheme()).toBe(name);
		}
	});

	test('persists theme in store', () => {
		setTheme('hotdog');
		expect(themeStore.get()).toBe('hotdog');
	});

	test('applies theme class to document.documentElement', () => {
		setTheme('sanity');
		expect(document.documentElement.classList.contains('sanity')).toBe(true);
	});

	test('removes previous theme class when switching', () => {
		setTheme('light');
		expect(document.documentElement.classList.contains('light')).toBe(true);

		setTheme('hotdog');
		expect(document.documentElement.classList.contains('hotdog')).toBe(true);
		expect(document.documentElement.classList.contains('light')).toBe(false);
	});

	test('only one theme class is present at a time', () => {
		for (const name of themeNames) {
			setTheme(name);
			const activeThemes = Array.from(themeNames).filter((t) => document.documentElement.classList.contains(t));
			expect(activeThemes).toEqual([name]);
		}
	});

	test('themeStore.get() matches getTheme()', () => {
		setTheme('sanity');
		expect(themeStore.get()).toBe(getTheme());
	});

	test('recovers gracefully from corrupted localStorage value', () => {
		// Simulate a corrupted value written by a browser extension or manual edit
		setTestStorageKey('theme', 'invalid-theme');

		// Store should have auto-corrected to a valid theme
		expect(themeNames).toContain(getTheme());
		// The corrupted class should not be on the document
		expect(document.documentElement.classList.contains('invalid-theme')).toBe(false);
	});
});

describe('paletteStore', () => {
	test('getPalette returns a value', () => {
		const palette = getPalette();
		expect(palette === '' || palette === undefined).toBe(true);
	});

	test('setPalette updates the palette', () => {
		setPalette('');
		expect(getPalette()).toBe('');
	});
});
