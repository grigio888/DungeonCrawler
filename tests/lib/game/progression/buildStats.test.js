import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/core/enum/stats.js';
import { buildStatsForLevel, getTotalStatPoints } from '$lib/game/progression';

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

	it('adds class vital progression from level 2 onward', () => {
		const vitalProgression = { hpPerLevel: 10, spPerLevel: 4 };
		const level1 = buildStatsForLevel(1, weights, { hp: 20, mp: 8 }, vitalProgression);
		const level5 = buildStatsForLevel(5, weights, { hp: 20, mp: 8 }, vitalProgression);

		const levelBonusHp = (5 - 1) * 10;
		const levelBonusSp = (5 - 1) * 4;

		expect(level1.maxHp).toBe(20 + (level1.scales[SCALES.VITALITY] ?? 0) * 5);
		expect(level1.maxSp).toBe(8 + (level1.scales[SCALES.INTELLIGENCE] ?? 0) * 3);
		expect(level5.maxHp).toBe(20 + levelBonusHp + (level5.scales[SCALES.VITALITY] ?? 0) * 5);
		expect(level5.maxSp).toBe(8 + levelBonusSp + (level5.scales[SCALES.INTELLIGENCE] ?? 0) * 3);
	});
});
