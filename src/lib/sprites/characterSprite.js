import { DEFAULT_FACING, FACING_VALUES } from './enums.js';

/** @typedef {import('./enums.js').Facing} Facing */
/** @typedef {import('$lib/characters/enums.js').Gender} Gender */

/**
 * @param {unknown} facing
 * @returns {facing is Facing}
 */
export function isValidFacing(facing) {
	return typeof facing === 'string' && FACING_VALUES.includes(/** @type {Facing} */ (facing));
}

/**
 * @param {unknown} facing
 * @returns {Facing}
 */
export function resolveFacing(facing) {
	if (isValidFacing(facing)) return facing;
	return DEFAULT_FACING;
}

/**
 * @param {Gender} gender
 * @param {unknown} [facing]
 * @returns {string}
 */
export function buildCharacterSpriteKey(gender, facing) {
	return `${gender}_idle_${resolveFacing(facing)}`;
}
