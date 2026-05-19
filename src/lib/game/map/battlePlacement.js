/** @typedef {import('./types.js').GeneratedMap} GeneratedMap */
/** @typedef {import('./types.js').MapCoord} MapCoord */

/**
 * Default tile positions on the battle arena.
 * Same center column (e.g. 6-3 / 6-8); opponent north, player south.
 *
 * @param {GeneratedMap} map
 * @returns {{ player: MapCoord, opponent: MapCoord }}
 */
export function getBattleCombatantCoords(map) {
	const { battleBounds } = map;
	const column = battleBounds.x + Math.floor(battleBounds.width / 2);
	const northRow = battleBounds.y;
	const southRow = battleBounds.y + battleBounds.height - 1;

	return {
		opponent: { x: column, y: northRow },
		player: { x: column, y: southRow }
	};
}
