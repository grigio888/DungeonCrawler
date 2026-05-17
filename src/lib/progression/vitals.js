import { SCALES } from '$lib/enums';

import { HP_PER_VITALITY, MP_PER_INTELLIGENCE } from './constants.js';

/**
 * Per-class growth applied from level 2 onward (level 1 uses `baseVitals` only).
 * @typedef {{ hpPerLevel?: number, spPerLevel?: number }} VitalProgression
 */

/**
 * @typedef {Object} ComputeVitalsOptions
 * @property {number} [level]
 * @property {VitalProgression | null} [vitalProgression]
 */

/**
 * @param {Record<string, number>} stats
 * @param {{ hp?: number, mp?: number }} [baseVitals]
 * @param {ComputeVitalsOptions} [options]
 */
export function computeVitals(stats, baseVitals = {}, options = {}) {
	const level = options.level ?? 1;
	const vitalProgression = options.vitalProgression ?? null;

	let maxHp = baseVitals.hp ?? 0;
	let maxSp = baseVitals.mp ?? 0;

	if (vitalProgression) {
		const extraLevels = Math.max(0, level - 1);
		maxHp += extraLevels * (vitalProgression.hpPerLevel ?? 0);
		maxSp += extraLevels * (vitalProgression.spPerLevel ?? 0);
	}

	maxHp += (stats[SCALES.VITALITY] ?? 0) * HP_PER_VITALITY;
	maxSp += (stats[SCALES.INTELLIGENCE] ?? 0) * MP_PER_INTELLIGENCE;

	return { maxHp, maxSp };
}
