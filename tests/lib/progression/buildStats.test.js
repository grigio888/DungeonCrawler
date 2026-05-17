import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/enums';
import { buildStatsForLevel, getTotalStatPoints } from '$lib/progression';

describe('progression/buildStats', () => {
	const weights = {
		[SCALES.STRENGTH]: 0.25,
		[SCALES.AGILITY]: 0.25,
		[SCALES.VITALITY]: 0.25,
		[SCALES.INTELLIGENCE]: 0.25,
		[SCALES.DEXTERITY]: 0,
		[SCALES.LUCK]: 0
	};

	it('builds vitals from allocated stats and base vitals', () => {
		const { scales, maxHp, maxSp } = buildStatsForLevel(1, weights, { hp: 10, mp: 5 });

		const allocatedTotal =
			(scales[SCALES.STRENGTH] ?? 0) +
			(scales[SCALES.AGILITY] ?? 0) +
			(scales[SCALES.VITALITY] ?? 0) +
			(scales[SCALES.INTELLIGENCE] ?? 0);

		expect(allocatedTotal).toBe(getTotalStatPoints(1));
		expect(maxHp).toBe(10 + (scales[SCALES.VITALITY] ?? 0) * 5);
		expect(maxSp).toBe(5 + (scales[SCALES.INTELLIGENCE] ?? 0) * 3);
	});
});
