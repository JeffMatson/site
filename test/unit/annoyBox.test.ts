import { beforeEach, describe, expect, test } from 'vitest';
import { FORK_CAP, forkAnnoyBox, generateAnnoyBoxProps, getAnnoyBoxPosition } from '../../src/components/AnnoyBox';
import { addAnnoyBox, annoyBoxStore, removeAllAnnoyBoxes } from '../../src/stores/annoyBoxStore';

describe('getAnnoyBoxPosition', () => {
	test('returns non-negative coordinates', () => {
		for (let i = 0; i < 50; i++) {
			const pos = getAnnoyBoxPosition();
			expect(pos.x).toBeGreaterThanOrEqual(0);
			expect(pos.y).toBeGreaterThanOrEqual(0);
		}
	});

	test('keeps boxes within viewport bounds', () => {
		for (let i = 0; i < 50; i++) {
			const pos = getAnnoyBoxPosition();
			expect(pos.x).toBeLessThan(1024);
			expect(pos.y).toBeLessThan(768);
		}
	});

	test('produces non-negative values on narrow viewports', () => {
		const originalInner = window.innerWidth;
		const originalClient = document.documentElement.clientWidth;
		Object.defineProperty(window, 'innerWidth', { value: 200, writable: true });
		Object.defineProperty(document.documentElement, 'clientWidth', { value: 200, writable: true });

		for (let i = 0; i < 50; i++) {
			const pos = getAnnoyBoxPosition();
			expect(pos.x).toBeGreaterThanOrEqual(0);
			expect(pos.y).toBeGreaterThanOrEqual(0);
		}

		Object.defineProperty(window, 'innerWidth', { value: originalInner, writable: true });
		Object.defineProperty(document.documentElement, 'clientWidth', { value: originalClient, writable: true });
	});
});

describe('forkAnnoyBox', () => {
	beforeEach(() => {
		removeAllAnnoyBoxes();
	});

	test('FORK_CAP is 16', () => {
		expect(FORK_CAP).toBe(16);
	});

	test('fork replaces one box with two when under cap', () => {
		const props = generateAnnoyBoxProps();
		const originalId = 'test-box';
		addAnnoyBox(originalId, props);
		expect(Object.keys(annoyBoxStore.get()).length).toBe(1);

		forkAnnoyBox(originalId);

		const boxes = annoyBoxStore.get();
		expect(Object.keys(boxes).length).toBe(2);
		expect(boxes[originalId]).toBeUndefined();
	});

	test('fork only removes box when at cap', () => {
		for (let i = 0; i < FORK_CAP; i++) {
			const props = generateAnnoyBoxProps();
			addAnnoyBox(`box-${i}`, props);
		}
		expect(Object.keys(annoyBoxStore.get()).length).toBe(FORK_CAP);

		forkAnnoyBox('box-0');

		const boxes = annoyBoxStore.get();
		expect(Object.keys(boxes).length).toBe(FORK_CAP - 1);
		expect(boxes['box-0']).toBeUndefined();
	});

	test('fork works normally at one below cap', () => {
		for (let i = 0; i < FORK_CAP - 1; i++) {
			const props = generateAnnoyBoxProps();
			addAnnoyBox(`box-${i}`, props);
		}
		expect(Object.keys(annoyBoxStore.get()).length).toBe(FORK_CAP - 1);

		forkAnnoyBox('box-0');

		expect(Object.keys(annoyBoxStore.get()).length).toBe(FORK_CAP);
	});
});

describe('generateAnnoyBoxProps', () => {
	test('confirmation box has expected shape', () => {
		const props = generateAnnoyBoxProps({ isConfirmation: true });

		expect(props.isConfirmation).toBe(true);
		expect(props.buttons).toHaveLength(2);
		expect(props.position.x).toBeGreaterThanOrEqual(0);
		expect(props.position.y).toBeGreaterThanOrEqual(0);
	});

	test('regular box has expected shape', () => {
		const props = generateAnnoyBoxProps();

		expect(props.isConfirmation).toBe(false);
		expect(props.id).toBeTypeOf('string');
		expect(props.position.x).toBeGreaterThanOrEqual(0);
		expect(props.position.y).toBeGreaterThanOrEqual(0);
		expect(props.buttons.length).toBeGreaterThan(0);
	});
});
