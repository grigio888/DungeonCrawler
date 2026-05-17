import { DEFAULT_FACING, FACING_ORDER, FACING_VALUES } from './enums.js';

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
 * @param {string} [animation]
 * @returns {string}
 */
export function buildCharacterSpriteKey(gender, facing, animation = 'idle') {
	return `${gender}_${animation}_${resolveFacing(facing)}`;
}

const SPRITE_FILE_PATTERN = /^[a-z]+_([a-z0-9]+)_([a-z]{2})\.(png|webp|gif)$/i;

/**
 * Animations and facings available under a class sprites folder for a gender.
 * @param {Record<string, unknown>} globEntries
 * @param {string} promptPath
 * @param {Gender} gender
 */
export function listClassSpriteOptions(globEntries, promptPath, gender) {
	/** @type {Set<string>} */
	const animations = new Set();
	/** @type {Record<string, Set<string>>} */
	const facingsByAnimation = {};

	for (const path of Object.keys(globEntries)) {
		if (!path.includes(`/classes/${promptPath}/sprites/`)) continue;

		const filename = path.split('/').pop() ?? '';
		if (!filename.startsWith(`${gender}_`)) continue;

		const match = filename.match(SPRITE_FILE_PATTERN);
		if (!match) continue;

		const animation = match[1];
		const facing = match[2].toLowerCase();

		animations.add(animation);
		if (!facingsByAnimation[animation]) facingsByAnimation[animation] = new Set();
		facingsByAnimation[animation].add(facing);
	}

	const sortedAnimations = [...animations].sort();

	/** @type {Record<string, string[]>} */
	const facings = {};
	for (const animation of sortedAnimations) {
		const values = [...(facingsByAnimation[animation] ?? [])];
		values.sort((a, b) => {
			const orderA = FACING_ORDER.indexOf(/** @type {import('./enums.js').Facing} */ (a));
			const orderB = FACING_ORDER.indexOf(/** @type {import('./enums.js').Facing} */ (b));
			if (orderA >= 0 && orderB >= 0) return orderA - orderB;
			if (orderA >= 0) return -1;
			if (orderB >= 0) return 1;
			return a.localeCompare(b);
		});
		facings[animation] = values;
	}

	return { animations: sortedAnimations, facingsByAnimation: facings };
}
