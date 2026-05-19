export {
	ALLOCATABLE_SCALES,
	BASE_CHARACTER_STAT_VALUE,
	HP_PER_VITALITY,
	MP_PER_INTELLIGENCE
} from '$lib/core/constants/progression.js';
export {
	applyLevelStatGains,
	buildCharacterScales,
	createBaseCharacterScales,
	getBaseCharacterStatTotal,
	getExpectedCharacterStatTotal,
	resolveCharacterScales,
	sumAllocatableScales
} from './characterScales.js';
export { buildStatsForLevel, pickAllocatableWeights } from './buildStats.js';
export { distributeStatPoints } from './distribute.js';
export { getPointsPerLevel, getTotalStatPoints } from './statPoints.js';
export { computeVitals } from './vitals.js';

/** @typedef {import('./vitals.js').VitalProgression} VitalProgression */
