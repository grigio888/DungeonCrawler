/**
 * Isometric diagonal facings used in-game (RO-style compass corners).
 * Sprite files: `{gender}_idle_{facing}.png` (e.g. `female_idle_sw.png`).
 * @enum {string}
 */
export const FACING = {
	SW: 'sw',
	SE: 'se',
	NW: 'nw',
	NE: 'ne'
};

/** @typedef {typeof FACING[keyof typeof FACING]} Facing */

/** Clockwise from south-west. */
export const FACING_ORDER = [FACING.SW, FACING.SE, FACING.NE, FACING.NW];

/** @type {Facing[]} */
export const FACING_VALUES = Object.values(FACING);

/** @type {Facing} */
export const DEFAULT_FACING = FACING.SW;
