import { beforeEach, describe, expect, test } from 'vitest';
import { setTestStorageKey, useTestStorageEngine } from '@nanostores/persistent';

useTestStorageEngine();

const {
	advancedModeStore,
	advancedOverridesStore,
	getAdvancedOverrides,
	setAdvancedMode,
	setAdvancedOverride,
	removeAdvancedOverride,
	resetAdvancedOverrides,
	setTheme,
} = await import('../../src/stores/themeStore');

beforeEach(() => {
	// Reset state — toggle to force subscriber execution
	setAdvancedMode('true');
	setAdvancedMode('false');
	resetAdvancedOverrides();
	setTheme('dark');
});

describe('advancedModeStore', () => {
	test('defaults to false', () => {
		expect(advancedModeStore.get()).toBe('false');
	});

	test('setAdvancedMode enables advanced mode', () => {
		setAdvancedMode('true');
		expect(advancedModeStore.get()).toBe('true');
	});

	test('setAdvancedMode disables advanced mode', () => {
		setAdvancedMode('true');
		setAdvancedMode('false');
		expect(advancedModeStore.get()).toBe('false');
	});

	test('recovers from corrupted localStorage value', () => {
		setTestStorageKey('advancedMode', 'invalid');
		expect(advancedModeStore.get()).toBe('false');
	});
});

describe('advancedOverridesStore', () => {
	test('defaults to empty object', () => {
		expect(getAdvancedOverrides()).toEqual({});
	});

	test('setAdvancedOverride adds an override', () => {
		setAdvancedOverride('color-background', '#ff0000');
		const overrides = getAdvancedOverrides();
		expect(overrides['color-background']).toBe('#ff0000');
	});

	test('setAdvancedOverride updates existing override', () => {
		setAdvancedOverride('color-background', '#ff0000');
		setAdvancedOverride('color-background', '#00ff00');
		expect(getAdvancedOverrides()['color-background']).toBe('#00ff00');
	});

	test('multiple overrides can coexist', () => {
		setAdvancedOverride('color-background', '#ff0000');
		setAdvancedOverride('color-text', '#00ff00');
		const overrides = getAdvancedOverrides();
		expect(overrides['color-background']).toBe('#ff0000');
		expect(overrides['color-text']).toBe('#00ff00');
	});

	test('removeAdvancedOverride removes a single override', () => {
		setAdvancedOverride('color-background', '#ff0000');
		setAdvancedOverride('color-text', '#00ff00');
		removeAdvancedOverride('color-background');
		const overrides = getAdvancedOverrides();
		expect(overrides['color-background']).toBeUndefined();
		expect(overrides['color-text']).toBe('#00ff00');
	});

	test('resetAdvancedOverrides clears all overrides', () => {
		setAdvancedOverride('color-background', '#ff0000');
		setAdvancedOverride('color-text', '#00ff00');
		resetAdvancedOverrides();
		expect(getAdvancedOverrides()).toEqual({});
	});

	test('handles corrupted JSON gracefully', () => {
		setTestStorageKey('advancedOverrides', 'not-valid-json');
		expect(getAdvancedOverrides()).toEqual({});
	});
});

describe('advanced mode inline style application', () => {
	test('applies overrides as inline styles when advanced mode is on', () => {
		setAdvancedMode('true');
		setAdvancedOverride('color-background', '#ff0000');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ff0000');
	});

	test('does not apply inline styles when advanced mode is off', () => {
		setAdvancedOverride('color-background', '#ff0000');
		setAdvancedMode('false');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('');
	});

	test('clears inline styles when advanced mode is turned off', () => {
		setAdvancedMode('true');
		setAdvancedOverride('color-background', '#ff0000');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ff0000');

		setAdvancedMode('false');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('');
	});

	test('updates inline styles when overrides change', () => {
		setAdvancedMode('true');
		setAdvancedOverride('color-background', '#ff0000');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ff0000');

		setAdvancedOverride('color-background', '#00ff00');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#00ff00');
	});

	test('removes inline style when individual override is removed', () => {
		setAdvancedMode('true');
		setAdvancedOverride('color-background', '#ff0000');
		setAdvancedOverride('color-text', '#00ff00');

		removeAdvancedOverride('color-background');
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('');
		expect(document.documentElement.style.getPropertyValue('--color-text')).toBe('#00ff00');
	});

	test('theme class is still applied in advanced mode', () => {
		setTheme('light');
		setAdvancedMode('true');
		expect(document.documentElement.classList.contains('light')).toBe(true);
	});

	test('base theme can be changed while in advanced mode', () => {
		setAdvancedMode('true');
		setAdvancedOverride('color-background', '#ff0000');
		setTheme('light');
		expect(document.documentElement.classList.contains('light')).toBe(true);
		expect(document.documentElement.style.getPropertyValue('--color-background')).toBe('#ff0000');
	});
});
