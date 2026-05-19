import { TILE_ROTATION_COUNT, TILE_ROTATION_STEP_DEG } from '$lib/core/constants/map.js';

/** @typedef {import('./types.js').TileRotation} TileRotation */

/**
 * Normalizes camera yaw to quarter turns (0–3).
 * @param {number} rotation
 * @returns {TileRotation}
 */
export function normalizeTileRotation(rotation) {
	const steps = Math.trunc(rotation) % TILE_ROTATION_COUNT;
	const normalized = steps < 0 ? steps + TILE_ROTATION_COUNT : steps;
	return /** @type {TileRotation} */ (normalized);
}

/**
 * @param {TileRotation | number} rotation
 */
export function tileRotationDegrees(rotation) {
	return normalizeTileRotation(rotation) * TILE_ROTATION_STEP_DEG;
}

export { TILE_ROTATION_COUNT, TILE_ROTATION_STEP_DEG };
