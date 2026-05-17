import { expect } from 'vitest';

import { ALLOCATABLE_SCALES } from '$lib/progression';

const CLASS_ID_PATTERN = /^[a-z][a-z0-9_]*$/;

/**
 * @param {unknown} definition
 * @param {string} [label]
 * @param {Record<string, { id: string, tier?: number }>} [registry]
 */
export function expectClassDefinition(definition, label = 'class', registry = {}) {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const classDef = /** @type {Record<string, unknown>} */ (definition);

	expect(classDef.id, `${label}.id`).toEqual(expect.any(String));
	expect(classDef.id).toMatch(CLASS_ID_PATTERN);

	expect(classDef.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(classDef.name).length).toBeGreaterThan(0);

	expect(classDef.description, `${label}.description`).toEqual(expect.any(String));

	expect(classDef.statWeights, `${label}.statWeights`).toEqual(expect.any(Object));
	const statWeights = /** @type {Record<string, number>} */ (classDef.statWeights);
	let weightSum = 0;

	for (const scale of ALLOCATABLE_SCALES) {
		const weight = statWeights[scale] ?? 0;
		expect(weight, `${label}.statWeights.${scale}`).toBeGreaterThanOrEqual(0);
		weightSum += weight;
	}

	expect(weightSum, `${label}.statWeights sum`).toBeCloseTo(1, 5);

	expect(classDef.baseVitals, `${label}.baseVitals`).toEqual(expect.any(Object));
	const baseVitals = /** @type {Record<string, unknown>} */ (classDef.baseVitals);
	expect(baseVitals.hp, `${label}.baseVitals.hp`).toEqual(expect.any(Number));
	expect(baseVitals.mp, `${label}.baseVitals.mp`).toEqual(expect.any(Number));

	expect(classDef.vitalProgression, `${label}.vitalProgression`).toEqual(expect.any(Object));
	const vitalProgression = /** @type {Record<string, unknown>} */ (classDef.vitalProgression);
	expect(vitalProgression.hpPerLevel, `${label}.vitalProgression.hpPerLevel`).toEqual(
		expect.any(Number)
	);
	expect(vitalProgression.spPerLevel, `${label}.vitalProgression.spPerLevel`).toEqual(
		expect.any(Number)
	);

	expect(classDef.jobRequirements, `${label}.jobRequirements`).toEqual(expect.any(Array));
	const jobRequirements = /** @type {string[]} */ (classDef.jobRequirements);

	const classId = /** @type {string} */ (classDef.id);
	const tier = /** @type {number} */ (classDef.tier ?? 0);

	for (const requirement of jobRequirements) {
		expect(requirement, `${label}.jobRequirements[]`).toEqual(expect.any(String));
		expect(requirement, `${label}.jobRequirements[] (not self)`).not.toBe(classId);

		expect(
			registry,
			`${label}.jobRequirements.${requirement} must exist in classes registry`
		).toHaveProperty(requirement);

		const requiredClass = registry[requirement];
		const requiredTier = requiredClass?.tier ?? 0;

		expect(
			requiredTier,
			`${label}.jobRequirements.${requirement} must be a lower tier than ${classId}`
		).toBeLessThan(tier);
	}


	if (tier === 0) {
		expect(jobRequirements, `${label}.jobRequirements (tier 0)`).toEqual([]);
	} else if (tier >= 1) {
		expect(jobRequirements, `${label}.jobRequirements (tier 1+)`).toContain('peasant');
	}
}
