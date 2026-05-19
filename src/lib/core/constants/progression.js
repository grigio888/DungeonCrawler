import { SCALES } from '../enum/stats.js';

/** Starting value per allocatable stat on a base character (before class level gains). */
export const BASE_CHARACTER_STAT_VALUE = 5;

/** Stats filled by level point allocation (HP/MP come from vitals formulas). */
export const ALLOCATABLE_SCALES = [
	SCALES.STRENGTH,
	SCALES.AGILITY,
	SCALES.VITALITY,
	SCALES.INTELLIGENCE,
	SCALES.DEXTERITY,
	SCALES.LUCK
];

/** HP added per point of vitality on the built stat block. */
export const HP_PER_VITALITY = 5;

/** MP added per point of intelligence on the built stat block. */
export const MP_PER_INTELLIGENCE = 3;
