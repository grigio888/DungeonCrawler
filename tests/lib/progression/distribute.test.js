import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/enums';
import { distributeStatPoints } from '$lib/progression';

describe('progression/distribute', () => {
	it('allocates the full pool deterministically', () => {
		const weights = {
			[SCALES.STRENGTH]: 0.2,
			[SCALES.VITALITY]: 0.8
		};

		const first = distributeStatPoints(12, weights);
		const second = distributeStatPoints(12, weights);

		expect(first).toEqual(second);
		expect(Object.values(first).reduce((sum, value) => sum + value, 0)).toBe(12);
	});

	it('returns an empty object when the pool is zero', () => {
		expect(distributeStatPoints(0, { [SCALES.STRENGTH]: 1 })).toEqual({});
	});
});
