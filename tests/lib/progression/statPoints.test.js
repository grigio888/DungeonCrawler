import { describe, expect, it } from 'vitest';

import { getPointsPerLevel, getTotalStatPoints } from '$lib/progression';

describe('progression/statPoints', () => {
	it('grants 3 points per level from level 1 through 4', () => {
		expect(getPointsPerLevel(1)).toBe(3);
		expect(getPointsPerLevel(4)).toBe(3);
		expect(getTotalStatPoints(1)).toBe(3);
		expect(getTotalStatPoints(4)).toBe(12);
	});

	it('increases the per-level grant after threshold 4', () => {
		expect(getPointsPerLevel(5)).toBe(4);
		expect(getTotalStatPoints(5)).toBe(16);
	});

	it('returns 0 for non-positive levels', () => {
		expect(getTotalStatPoints(0)).toBe(0);
		expect(getPointsPerLevel(0)).toBe(0);
	});
});
