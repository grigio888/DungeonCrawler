import { LEVEL_PROGRESSION } from '$lib/enums';

/** @type {number[]} */
const THRESHOLDS = Object.keys(LEVEL_PROGRESSION)
	.map(Number)
	.sort((a, b) => a - b);

/**
 * Stat points gained when reaching `level` (1-based).
 * Uses the smallest threshold T where level <= T.
 * @param {number} level
 */
export function getPointsPerLevel(level) {
	if (level < 1) return 0;

	for (const threshold of THRESHOLDS) {
		if (level <= threshold) {
			return LEVEL_PROGRESSION[threshold];
		}
	}

	return LEVEL_PROGRESSION[THRESHOLDS[THRESHOLDS.length - 1]];
}

/**
 * Total allocatable stat points from level 1 through `level` (inclusive).
 * @param {number} level
 */
export function getTotalStatPoints(level) {
	const capped = Math.max(0, Math.floor(level));
	let total = 0;

	for (let current = 1; current <= capped; current++) {
		total += getPointsPerLevel(current);
	}

	return total;
}
