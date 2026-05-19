import { FACING_ORDER } from '$lib/core/constants/sprites.js';
import { resolveFacing } from '$lib/core/helpers/sprites.js';
import { pathMatchesClassSpriteFolder } from './classSpritePath.js';

/** @typedef {import('$lib/core/enum/sprites.js').Facing} Facing */
/** @typedef {import('$lib/core/enum/characters.js').Gender} Gender */

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
		if (!pathMatchesClassSpriteFolder(path, promptPath)) continue;

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
			const orderA = FACING_ORDER.indexOf(/** @type {Facing} */ (a));
			const orderB = FACING_ORDER.indexOf(/** @type {Facing} */ (b));
			if (orderA >= 0 && orderB >= 0) return orderA - orderB;
			if (orderA >= 0) return -1;
			if (orderB >= 0) return 1;
			return a.localeCompare(b);
		});
		facings[animation] = values;
	}

	return { animations: sortedAnimations, facingsByAnimation: facings };
}
