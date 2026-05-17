import { SCALES } from '$lib/enums';

import { HP_PER_VITALITY, MP_PER_INTELLIGENCE } from './constants.js';

/**
 * @param {Record<string, number>} stats
 * @param {{ hp?: number, mp?: number }} [baseVitals]
 */
export function computeVitals(stats, baseVitals = {}) {
	const baseHp = baseVitals.hp ?? 0;
	const baseMp = baseVitals.mp ?? 0;

	const maxHp =
		baseHp + (stats[SCALES.VITALITY] ?? 0) * HP_PER_VITALITY + (stats[SCALES.HP] ?? 0);
	const maxSp =
		baseMp +
		(stats[SCALES.INTELLIGENCE] ?? 0) * MP_PER_INTELLIGENCE +
		(stats[SCALES.MP] ?? 0);

	return { maxHp, maxSp };
}
