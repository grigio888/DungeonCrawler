import { describe, expect, it } from 'vitest';

import {
	createInitialClassHistory,
	getCurrentClassId,
	isOnCurrentClass,
	normalizeClassHistory
} from '../../src/db/classHistory.js';

describe('db/classHistory', () => {
	it('normalizes valid entries', () => {
		expect(
			normalizeClassHistory([
				['peasant', 9],
				['swordsman', 15]
			])
		).toEqual([
			['peasant', 9],
			['swordsman', 15]
		]);
	});

	it('returns empty for invalid input', () => {
		expect(normalizeClassHistory(null)).toEqual([]);
		expect(normalizeClassHistory([['', 1]])).toEqual([]);
	});

	it('uses the last entry as the current class', () => {
		const history = [
			['peasant', 9],
			['swordsman', 15]
		];

		expect(getCurrentClassId(history)).toBe('swordsman');
	});

	it('detects when level matches the current class registration', () => {
		const history = [
			['peasant', 9],
			['swordsman', 15]
		];

		expect(isOnCurrentClass(history, 15)).toBe(true);
		expect(isOnCurrentClass(history, 20)).toBe(false);
	});

	it('creates an initial history entry', () => {
		expect(createInitialClassHistory('mage', 1)).toEqual([['mage', 1]]);
	});
});
