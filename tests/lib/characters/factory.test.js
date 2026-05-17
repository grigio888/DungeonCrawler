import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/enums';
import { buildClassStats } from '$lib/classes';
import {
	ALLOCATABLE_SCALES,
	BASE_CHARACTER_STAT_VALUE,
	getExpectedCharacterStatTotal,
	getTotalStatPoints
} from '$lib/progression';
import CLASSES from '$lib/classes';
import { createCharacterSpec } from '$lib/characters/factory';
import BaseCharacter from '$lib/characters/controller';

/**
 * @param {import('$lib/classes').ClassDefinition} classDef
 * @param {number} level
 * @param {Record<string, number>} scales
 */
function expectedMaxHp(classDef, level, scales) {
	const base = classDef.baseVitals?.hp ?? 0;
	const perLevel = classDef.vitalProgression?.hpPerLevel ?? 0;
	const levelBonus = Math.max(0, level - 1) * perLevel;
	const vitBonus = (scales[SCALES.VITALITY] ?? 0) * 5;
	return base + levelBonus + vitBonus;
}

/**
 * @param {import('$lib/classes').ClassDefinition} classDef
 * @param {number} level
 * @param {Record<string, number>} scales
 */
function expectedMaxSp(classDef, level, scales) {
	const base = classDef.baseVitals?.mp ?? 0;
	const perLevel = classDef.vitalProgression?.spPerLevel ?? 0;
	const levelBonus = Math.max(0, level - 1) * perLevel;
	const intBonus = (scales[SCALES.INTELLIGENCE] ?? 0) * 3;
	return base + levelBonus + intBonus;
}

describe('characters/factory', () => {
	it('starts with base 5 in every stat at level 1', () => {
		const spec = createCharacterSpec({ classId: 'peasant', level: 1 });

		for (const scale of ALLOCATABLE_SCALES) {
			expect(spec.scales[scale]).toBeGreaterThanOrEqual(BASE_CHARACTER_STAT_VALUE);
		}

		expect(getExpectedCharacterStatTotal(1)).toBe(
			BASE_CHARACTER_STAT_VALUE * ALLOCATABLE_SCALES.length + getTotalStatPoints(1)
		);
	});

	it('builds stats from class statWeights at level 4', () => {
		const spec = createCharacterSpec({ classId: 'peasant', level: 4 });
		const classDef = CLASSES.peasant;

		const allocatedTotal = Object.values(SCALES)
			.filter((key) => key !== SCALES.HP && key !== SCALES.MP)
			.reduce((sum, key) => sum + (spec.scales[key] ?? 0), 0);

		expect(spec.statWeights).toEqual(classDef.statWeights);
		expect(allocatedTotal).toBe(getExpectedCharacterStatTotal(4));
		expect(spec.maxHp).toBe(expectedMaxHp(classDef, 4, spec.scales));
		expect(spec.maxSp).toBe(expectedMaxSp(classDef, 4, spec.scales));
	});

	it('preserves stats on class change and applies new weights on level up', () => {
		const character = new BaseCharacter({ classId: 'peasant', level: 4 });
		const scalesBefore = { ...character.scales };

		character.patch({ classId: 'mage' });
		expect(character.scales).toEqual(scalesBefore);
		expect(character.classId).toBe('mage');

		character.patch({ level: 5 });
		expect(character.scales[SCALES.INTELLIGENCE]).toBeGreaterThan(
			scalesBefore[SCALES.INTELLIGENCE]
		);
	});

	it('applies different vital progression per class at level 10', () => {
		const level = 10;
		const peasant = buildClassStats('peasant', level);
		const swordsman = buildClassStats('swordsman', level);
		const mage = buildClassStats('mage', level);

		expect(swordsman.maxHp).toBeGreaterThan(peasant.maxHp);
		expect(mage.maxSp).toBeGreaterThan(swordsman.maxSp);
		expect(peasant.maxHp).toBe(expectedMaxHp(CLASSES.peasant, level, peasant.scales));
		expect(mage.maxSp).toBe(expectedMaxSp(CLASSES.mage, level, mage.scales));
	});

	it('defaults to peasant when class is unknown', () => {
		const spec = createCharacterSpec({ classId: 'unknown_class', level: 1 });
		expect(spec.classId).toBe('unknown_class');
		expect(spec.statWeights).toEqual(CLASSES.peasant.statWeights);
	});

	it('exposes scales through BaseCharacter', () => {
		const character = new BaseCharacter({ classId: 'peasant', level: 4 });
		expect(character.stats).toBe(character.scales);
		expect(character.level).toBe(4);
	});
});
