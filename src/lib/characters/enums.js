/**
 * Character gender.
 * @enum {string}
 */
export const GENDER = {
	MALE: 'male',
	FEMALE: 'female'
};

/** @typedef {typeof GENDER[keyof typeof GENDER]} Gender */

/** @type {Gender[]} */
export const GENDER_VALUES = Object.values(GENDER);
