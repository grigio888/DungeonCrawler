import { SCALES } from '../enum/stats.js';

/** Stats eligible to be the dominant damage scale (highest class statWeight wins). */
export const DAMAGE_DOMINANT_SCALES = [
	SCALES.STRENGTH,
	SCALES.INTELLIGENCE,
	SCALES.DEXTERITY,
	SCALES.LUCK
];

/** Base critical hit chance before luck (10%). */
export const BASE_CRITICAL_CHANCE = 0.1;

/** Additional critical chance per luck point (1%). */
export const LUCK_CRITICAL_CHANCE_PER_POINT = 0.01;

/** +1% max-roll chance per dexterity point (before cap). */
export const DEX_MAX_ROLL_CHANCE_PER_POINT = 0.01;

/** Upper bound on rolling max damage from dexterity alone. */
export const DEX_MAX_ROLL_CHANCE_CAP = 0.85;
