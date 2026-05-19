import { FACING } from '../enum/sprites.js';
import { DEFAULT_FACING } from '../constants/sprites.js';

/** @typedef {import('../enum/sprites.js').Facing} Facing */

/** @type {Facing[]} */
export const FACING_VALUES = Object.values(FACING);

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
