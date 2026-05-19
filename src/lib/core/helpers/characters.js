import { GENDER } from '../enum/characters.js';

/** @typedef {import('../enum/characters.js').Gender} Gender */

/** @type {Gender[]} */
export const GENDER_VALUES = Object.values(GENDER);

/**
 * @param {unknown} gender
 * @returns {gender is Gender}
 */
export function isValidGender(gender) {
	return typeof gender === 'string' && GENDER_VALUES.includes(/** @type {Gender} */ (gender));
}

/**
 * @param {unknown} gender
 * @returns {Gender}
 */
export function resolveGender(gender) {
	if (isValidGender(gender)) return gender;
	return GENDER.FEMALE;
}
