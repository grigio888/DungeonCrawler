import { expect } from 'vitest';

import { ALLOCATABLE_SCALES, getTotalStatPoints } from '$lib/progression';
import { MONSTER_KIND } from '$lib/monsters/enums';

const MONSTER_ID_PATTERN = /^\d{4}_[a-z0-9_]+$/;
const MONSTER_KIND_VALUES = Object.values(MONSTER_KIND);

/**
 * @param {unknown} definition
 * @param {string} [label]
 */
export function expectMonsterDefinition(definition, label = 'monster') {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const monster = /** @type {Record<string, unknown>} */ (definition);

	expect(monster.id, `${label}.id`).toEqual(expect.any(String));
	expect(monster.id).toMatch(MONSTER_ID_PATTERN);

	expect(monster.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(monster.name).length).toBeGreaterThan(0);

	expect(monster.description, `${label}.description`).toEqual(expect.any(String));
	expect(String(monster.description).length).toBeGreaterThan(0);

	expect(MONSTER_KIND_VALUES, `${label}.kind`).toContain(monster.kind);

	expect(monster.tier, `${label}.tier`).toEqual(expect.any(Number));
	expect(Number.isInteger(monster.tier)).toBe(true);
	expect(/** @type {number} */ (monster.tier)).toBeGreaterThanOrEqual(0);

	if (monster.level !== undefined) {
		expect(monster.level, `${label}.level`).toEqual(expect.any(Number));
		expect(monster.level).toBeGreaterThanOrEqual(1);
	}

	expect(monster.statWeights, `${label}.statWeights`).toEqual(expect.any(Object));
	const statWeights = /** @type {Record<string, number>} */ (monster.statWeights);
	let weightSum = 0;

	for (const scale of ALLOCATABLE_SCALES) {
		const weight = statWeights[scale] ?? 0;
		expect(weight, `${label}.statWeights.${scale}`).toBeGreaterThanOrEqual(0);
		weightSum += weight;
	}

	expect(weightSum, `${label}.statWeights sum`).toBeCloseTo(1, 5);

	if (monster.baseVitals !== undefined) {
		const baseVitals = /** @type {Record<string, unknown>} */ (monster.baseVitals);
		if (baseVitals.hp !== undefined) {
			expect(baseVitals.hp, `${label}.baseVitals.hp`).toEqual(expect.any(Number));
		}
		if (baseVitals.mp !== undefined) {
			expect(baseVitals.mp, `${label}.baseVitals.mp`).toEqual(expect.any(Number));
		}
	}

	expect(monster.baseDamage, `${label}.baseDamage`).toEqual(expect.any(Object));
	const baseDamage = /** @type {{ min: number, max: number }} */ (monster.baseDamage);
	expect(baseDamage.min, `${label}.baseDamage.min`).toEqual(expect.any(Number));
	expect(baseDamage.max, `${label}.baseDamage.max`).toEqual(expect.any(Number));
	expect(baseDamage.min).toBeGreaterThanOrEqual(0);
	expect(baseDamage.max).toBeGreaterThanOrEqual(baseDamage.min);

	expect(monster.skills, `${label}.skills`).toEqual(expect.any(Array));
	for (const skill of /** @type {unknown[]} */ (monster.skills)) {
		expect(typeof skill === 'string' || typeof skill === 'object').toBe(true);
	}
}

/**
 * @param {import('$lib/monsters/factory.js').MonsterSpec} spec
 * @param {import('$lib/monsters/registry.js').default[string]} definition
 * @param {number} level
 * @param {string} [label]
 */
export function expectMonsterSpecMatchesLevel(spec, definition, level, label = 'monster') {
	expect(spec.level, `${label}.level`).toBe(level);
	expect(spec.statWeights, `${label}.statWeights`).toEqual(definition.statWeights);

	const allocatedTotal = ALLOCATABLE_SCALES.reduce(
		(sum, scale) => sum + (spec.scales[scale] ?? 0),
		0
	);

	expect(allocatedTotal).toBe(getTotalStatPoints(level));
}
