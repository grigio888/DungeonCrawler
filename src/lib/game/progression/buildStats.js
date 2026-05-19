import { SCALES } from '$lib/core/enum/stats.js';
import { ALLOCATABLE_SCALES } from '$lib/core/constants/progression.js';
import { distributeStatPoints } from './distribute.js';
import { getTotalStatPoints } from './statPoints.js';
import { computeVitals } from './vitals.js';

/**
 * @param {Record<string, number>} statWeights
 * @returns {Record<string, number>}
 */
export function pickAllocatableWeights(statWeights) {
	/** @type {Record<string, number>} */
	const weights = {};

	for (const scale of ALLOCATABLE_SCALES) {
		const weight = statWeights[scale] ?? 0;
		if (weight > 0) weights[scale] = weight;
	}

	return weights;
}

/**
 * Builds full scale block + vitals for a level and weight profile.
 * @param {number} level
 * @param {Record<string, number>} statWeights
 * @param {{ hp?: number, mp?: number }} [baseVitals]
 * @param {import('./vitals.js').VitalProgression | null} [vitalProgression]
 */
export function buildStatsForLevel(level, statWeights, baseVitals = {}, vitalProgression = null) {
	const pool = getTotalStatPoints(level);
	const allocated = distributeStatPoints(pool, pickAllocatableWeights(statWeights));

	/** @type {Record<string, number>} */
	const scales = Object.fromEntries(Object.values(SCALES).map((scale) => [scale, 0]));

	for (const [scale, value] of Object.entries(allocated)) {
		scales[scale] = value;
	}

	const { maxHp, maxSp } = computeVitals(scales, baseVitals, { level, vitalProgression });

	return { scales, maxHp, maxSp };
}
