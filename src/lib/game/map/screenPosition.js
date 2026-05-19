import { buildIsoTileLayout } from './isometric.js';
import { getIsoTileFaces } from './isoTileGeometry.js';
import { normalizeScenarioRotation } from './scenario.js';

/** @typedef {import('./types.js').GeneratedMap} GeneratedMap */
/** @typedef {import('./types.js').MapCoord} MapCoord */
/** @typedef {import('./types.js').TileRotation} TileRotation */

/**
 * Screen position of the top-face center for a grid tile (stage coordinates).
 *
 * @param {GeneratedMap} map
 * @param {MapCoord} coord
 * @param {TileRotation | number} [scenarioRotation]
 */
export function getIsoTileScreenCenter(map, coord, scenarioRotation = map.scenarioRotation ?? 0) {
	const rotation = normalizeScenarioRotation(scenarioRotation);
	const layout = buildIsoTileLayout(map, rotation);
	const entry = layout.entries.find(
		(candidate) => candidate.tile.x === coord.x && candidate.tile.y === coord.y
	);

	if (!entry) {
		return null;
	}

	const faces = getIsoTileFaces(layout.tileWidth, layout.tileHeight, layout.extrudeHeight);

	return {
		x: layout.offsetX + entry.screenX + faces.centerX,
		y: layout.offsetY + entry.screenY + faces.centerY,
		depth: entry.depth
	};
}

/**
 * Top-face center in display pixels (after view scale).
 *
 * @param {GeneratedMap} map
 * @param {MapCoord} coord
 * @param {number} viewScale
 * @param {TileRotation | number} [scenarioRotation]
 */
export function getIsoTileDisplayCenter(map, coord, viewScale, scenarioRotation = map.scenarioRotation ?? 0) {
	const center = getIsoTileScreenCenter(map, coord, scenarioRotation);

	if (!center) {
		return null;
	}

	return {
		x: center.x * viewScale,
		y: center.y * viewScale,
		depth: center.depth
	};
}
