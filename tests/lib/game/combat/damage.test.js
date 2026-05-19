import { describe, expect, it, vi } from 'vitest';

import { SCALES } from '$lib/core/enum/stats.js';
import {
	estimateDamage,
	getCriticalChance,
	getDominantDamageScale,
	getMaxDamageChance,
	maxDamageRange,
	rollDamageRange
} from '$lib/game/combat';

describe('combat/damage', () => {
	const stats = {
		[SCALES.STRENGTH]: 10,
		[SCALES.DEXTERITY]: 8,
		[SCALES.INTELLIGENCE]: 12,
		[SCALES.LUCK]: 4
	};

	it('picks the highest class damage scale weight among damage stats only', () => {
		expect(getDominantDamageScale({ [SCALES.STRENGTH]: 0.5, [SCALES.DEXTERITY]: 1 })).toBe(
			SCALES.DEXTERITY
		);

		expect(
			getDominantDamageScale({
				[SCALES.AGILITY]: 1,
				[SCALES.VITALITY]: 1,
				[SCALES.STRENGTH]: 0.2,
				[SCALES.INTELLIGENCE]: 0.3
			})
		).toBe(SCALES.INTELLIGENCE);
	});

	it('scales critical chance with luck from a 10% base', () => {
		expect(getCriticalChance(0)).toBe(0.1);
		expect(getCriticalChance(4)).toBe(0.14);
		expect(getCriticalChance(200)).toBe(1);
	});

	it('scales max-roll chance with dexterity up to a cap', () => {
		expect(getMaxDamageChance(0)).toBe(0);
		expect(getMaxDamageChance(8)).toBeCloseTo(0.08);
		expect(getMaxDamageChance(200)).toBe(0.85);
	});

	it('applies dominant-stat scaling and skill/weapon multiplicator', () => {
		const { damage } = estimateDamage({
			stats,
			classStatWeights: { [SCALES.STRENGTH]: 1 },
			skillScales: { [SCALES.STRENGTH]: 1 },
			baseDamage: { min: 2, max: 2 }
		});

		// initial 2 * (1 + 10 * 0.15) = 5, then * (1 + 1 * 0.5) = 7
		expect(damage).toBe(7);
	});

	it('adds weapon base damage before dominant-stat scaling', () => {
		const { damage } = estimateDamage({
			stats: { [SCALES.STRENGTH]: 5 },
			classStatWeights: { [SCALES.STRENGTH]: 1 },
			skillScales: { [SCALES.STRENGTH]: 1 },
			baseDamage: { min: 2, max: 2 },
			weapon: {
				scales: { [SCALES.STRENGTH]: 1 },
				damage: { min: 4, max: 4 }
			}
		});

		// initial (2 + 4) * (1 + 5 * 0.15) = 10.5, then * (1 + 2 * 0.5) = 21
		expect(damage).toBe(21);
	});

	it('skips skill multiplicator when skill marks dominant scale as unused', () => {
		const withStrength = estimateDamage({
			stats,
			classStatWeights: { [SCALES.STRENGTH]: 1 },
			skillScales: { [SCALES.STRENGTH]: 0.5 },
			baseDamage: { min: 2, max: 2 }
		});

		const withoutStrength = estimateDamage({
			stats,
			classStatWeights: { [SCALES.STRENGTH]: 1 },
			skillScales: { [SCALES.STRENGTH]: 0 },
			baseDamage: { min: 2, max: 2 }
		});

		// 5 * 1.25 = 6 vs 5 * 1 = 5
		expect(withStrength.damage).toBe(6);
		expect(withoutStrength.damage).toBe(5);
	});

	it('rolls class base damage between min and max', () => {
		const rolls = new Set();

		for (let index = 0; index < 40; index += 1) {
			rolls.add(
				estimateDamage({
					stats: { [SCALES.STRENGTH]: 0, [SCALES.LUCK]: 0 },
					classStatWeights: { [SCALES.STRENGTH]: 1 },
					skillScales: { [SCALES.STRENGTH]: 1 },
					baseDamage: { min: 3, max: 7 },
					randomizeBaseDamage: true
				}).damage
			);
		}

		expect(rolls.size).toBeGreaterThan(1);
	});

	it('uses average base damage when not randomizing', () => {
		const { damage, isCritical } = estimateDamage({
			stats: { [SCALES.STRENGTH]: 0 },
			classStatWeights: { [SCALES.STRENGTH]: 1 },
			skillScales: { [SCALES.STRENGTH]: 1 },
			baseDamage: { min: 2, max: 6 }
		});

		expect(damage).toBe(6);
		expect(isCritical).toBe(false);
	});

	it('rolls max damage more often with higher dexterity', () => {
		const range = { min: 1, max: 10 };
		const trials = 800;
		let lowDexMaxHits = 0;
		let highDexMaxHits = 0;

		for (let index = 0; index < trials; index += 1) {
			if (rollDamageRange(range, 0) === range.max) lowDexMaxHits += 1;
			if (rollDamageRange(range, 80) === range.max) highDexMaxHits += 1;
		}

		expect(highDexMaxHits).toBeGreaterThan(lowDexMaxHits);
	});

	it('uses max range values on critical hits when randomizing', () => {
		const random = vi.spyOn(Math, 'random');
		random.mockReturnValueOnce(0); // critical (luck 0 => 10%)
		random.mockReturnValue(0.99); // non-max dex rolls if reached

		const { damage, isCritical } = estimateDamage({
			stats: { [SCALES.STRENGTH]: 0, [SCALES.LUCK]: 0 },
			classStatWeights: { [SCALES.STRENGTH]: 1 },
			skillScales: { [SCALES.STRENGTH]: 0 },
			baseDamage: { min: 2, max: 8 },
			randomizeBaseDamage: true
		});

		expect(isCritical).toBe(true);
		expect(maxDamageRange({ min: 2, max: 8 })).toBe(8);
		// initial 8 * 1 * 1 = 8, then ×2 crit multiplier = 16
		expect(damage).toBe(16);

		random.mockRestore();
	});
});
