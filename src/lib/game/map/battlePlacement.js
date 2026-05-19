/** @typedef {import('./types.js').GeneratedMap} GeneratedMap */
/** @typedef {import('./types.js').MapCoord} MapCoord */

/**
 * Default tile positions on the common-ground battle grid.
 * Player on the left row; opponent on the right row (same center line).
 *
 * @param {GeneratedMap} map
 * @returns {{ player: MapCoord, opponent: MapCoord }}
 */
export function getBattleCombatantCoords(map) {
	const { battleBounds } = map;
	const row = battleBounds.y + Math.floor(battleBounds.height / 2);

	return {
		player: { x: battleBounds.x + 1, y: row },
		opponent: { x: battleBounds.x + battleBounds.width - 2, y: row }
	};
}
