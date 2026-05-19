import { SCALES } from '$lib/core/enum/stats.js';
import { ALLOCATABLE_SCALES, BASE_CHARACTER_STAT_VALUE } from '$lib/core/constants/progression.js';

import { pickAllocatableWeights } from './buildStats.js';
import { distributeStatPoints } from './distribute.js';
import { getPointsPerLevel, getTotalStatPoints } from './statPoints.js';

export { BASE_CHARACTER_STAT_VALUE };

/**
 * @param {Record<string, number>} scales
 */
export function sumAllocatableScales(scales) {
	return ALLOCATABLE_SCALES.reduce((sum, scale) => sum + (scales[scale] ?? 0), 0);
}

export function getBaseCharacterStatTotal() {
	return BASE_CHARACTER_STAT_VALUE * ALLOCATABLE_SCALES.length;
}

/**
 * Expected sum of allocatable stats at `level` (base floor + all level-up grants).
 * @param {number} level
 */
export function getExpectedCharacterStatTotal(level) {
	return getBaseCharacterStatTotal() + getTotalStatPoints(level);
}

/**
 * @returns {Record<string, number>}
 */
export function createBaseCharacterScales() {
	/** @type {Record<string, number>} */
	const scales = Object.fromEntries(Object.values(SCALES).map((scale) => [scale, 0]));

	for (const scale of ALLOCATABLE_SCALES) {
		scales[scale] = BASE_CHARACTER_STAT_VALUE;
	}

	return scales;
}

/**
 * Adds stat points earned from `fromLevel` through `toLevel` (inclusive) using `statWeights`.
 * @param {Record<string, number>} scales
 * @param {number} fromLevel
 * @param {number} toLevel
 * @param {Record<string, number>} statWeights
 */
export function applyLevelStatGains(scales, fromLevel, toLevel, statWeights) {
	if (toLevel < fromLevel) return { ...scales };

	const result = { ...scales };
	const weights = pickAllocatableWeights(statWeights);

	for (let level = fromLevel; level <= toLevel; level++) {
		const gain = distributeStatPoints(getPointsPerLevel(level), weights);

		for (const [key, value] of Object.entries(gain)) {
			result[key] = (result[key] ?? 0) + value;
		}
	}

	return result;
}

/**
 * Fresh character: base 5 in every allocatable stat, plus per-level gains from Lv.1..`level`.
 * @param {number} level
 * @param {Record<string, number>} statWeights
 */
export function buildCharacterScales(level, statWeights) {
	let scales = createBaseCharacterScales();

	if (level >= 1) {
		scales = applyLevelStatGains(scales, 1, level, statWeights);
	}

	return scales;
}

/**
 * @param {Object} options
 * @param {number} options.level
 * @param {Record<string, number>} options.statWeights
 * @param {Record<string, number>} [options.existingScales]
 * @param {number} [options.previousLevel]
 */
export function resolveCharacterScales({ level, statWeights, existingScales, previousLevel }) {
	if (existingScales != null && previousLevel != null) {
		const scales = { ...existingScales };

		if (level > previousLevel) {
			return applyLevelStatGains(scales, previousLevel + 1, level, statWeights);
		}

		return scales;
	}

	if (existingScales != null) {
		return { ...existingScales };
	}

	return buildCharacterScales(level, statWeights);
}
