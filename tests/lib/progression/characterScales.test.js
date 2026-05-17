import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/enums';
import CLASSES from '$lib/classes';
import {
	ALLOCATABLE_SCALES,
	BASE_CHARACTER_STAT_VALUE,
	applyLevelStatGains,
	buildCharacterScales,
	createBaseCharacterScales,
	getExpectedCharacterStatTotal,
	getPointsPerLevel,
	getTotalStatPoints,
	resolveCharacterScales
} from '$lib/progression';

describe('progression/characterScales', () => {
	it('starts with 5 in every allocatable stat', () => {
		const scales = createBaseCharacterScales();

		for (const scale of ALLOCATABLE_SCALES) {
			expect(scales[scale]).toBe(BASE_CHARACTER_STAT_VALUE);
		}
	});

	it('adds level gains on top of the base floor', () => {
		const level = 4;
		const scales = buildCharacterScales(level, CLASSES.peasant.statWeights);

		expect(getExpectedCharacterStatTotal(level)).toBe(
			BASE_CHARACTER_STAT_VALUE * ALLOCATABLE_SCALES.length + getTotalStatPoints(level)
		);

		for (const scale of ALLOCATABLE_SCALES) {
			expect(scales[scale]).toBeGreaterThanOrEqual(BASE_CHARACTER_STAT_VALUE);
		}
	});

	it('applies only new level gains when scales already exist', () => {
		const atLevel4 = buildCharacterScales(4, CLASSES.peasant.statWeights);
		const atLevel5 = resolveCharacterScales({
			level: 5,
			statWeights: CLASSES.peasant.statWeights,
			existingScales: atLevel4,
			previousLevel: 4
		});

		const manualGain = applyLevelStatGains({ ...atLevel4 }, 5, 5, CLASSES.peasant.statWeights);

		expect(atLevel5).toEqual(manualGain);
		expect(getPointsPerLevel(5)).toBe(4);
	});

	it('keeps existing stats when class changes without leveling', () => {
		const level = 6;
		const asPeasant = buildCharacterScales(level, CLASSES.peasant.statWeights);
		const asMage = resolveCharacterScales({
			level,
			statWeights: CLASSES.mage.statWeights,
			existingScales: asPeasant,
			previousLevel: level
		});

		expect(asMage).toEqual(asPeasant);
	});

	it('uses the new class weights only for levels gained after a class change', () => {
		const level = 5;
		const asPeasant = buildCharacterScales(4, CLASSES.peasant.statWeights);
		const switchedAndLeveled = resolveCharacterScales({
			level,
			statWeights: CLASSES.mage.statWeights,
			existingScales: asPeasant,
			previousLevel: 4
		});
		const freshMage = buildCharacterScales(level, CLASSES.mage.statWeights);

		expect(switchedAndLeveled).not.toEqual(freshMage);
		expect(switchedAndLeveled[SCALES.INTELLIGENCE]).toBeGreaterThan(asPeasant[SCALES.INTELLIGENCE]);
	});
});
