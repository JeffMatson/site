import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../../src/hooks/useIsMobile';

function mockMatchMedia(matches: boolean) {
	const listeners: Array<(e: { matches: boolean }) => void> = [];

	const mql = {
		matches,
		addEventListener: (_event: string, handler: (e: { matches: boolean }) => void) => {
			listeners.push(handler);
		},
		removeEventListener: (_event: string, handler: (e: { matches: boolean }) => void) => {
			const idx = listeners.indexOf(handler);
			if (idx >= 0) listeners.splice(idx, 1);
		},
	};

	vi.stubGlobal('matchMedia', () => mql);

	return {
		trigger: (newMatches: boolean) => {
			mql.matches = newMatches;
			for (const listener of listeners) {
				listener({ matches: newMatches });
			}
		},
	};
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('useIsMobile', () => {
	test('returns true when viewport matches mobile breakpoint', () => {
		mockMatchMedia(true);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	test('returns false when viewport is wider than breakpoint', () => {
		mockMatchMedia(false);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	test('updates when media query changes', () => {
		const { trigger } = mockMatchMedia(false);
		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);

		act(() => {
			trigger(true);
		});

		expect(result.current).toBe(true);
	});
});
