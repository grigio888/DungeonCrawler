import { FACING_ORDER } from '$lib/core/constants/sprites.js';
import { isoProject, yawInverseToGridCoord, yawRotateCoord } from './isometric.js';
import { normalizeTileRotation } from './tile.js';

/** @typedef {import('./types.js').TileRotation} TileRotation */
/** @typedef {import('./types.js').MapCoord} MapCoord */
/** @typedef {import('./types.js').GeneratedMap} GeneratedMap */
/** @typedef {import('./types.js').MapTile} MapTile */
/** @typedef {import('./types.js').MapRect} MapRect */
/** @typedef {import('./types.js').MapTrack} MapTrack */

/**
 * Camera yaw around the vertical axis (0–3 quarter turns).
 * @param {TileRotation | number} rotation
 * @returns {TileRotation}
 */
export function normalizeScenarioRotation(rotation) {
	return normalizeTileRotation(rotation);
}

/**
 * Grid coord after yaw (for overlays that still use tile indices).
 * @param {MapCoord} coord
 * @param {number} size
 * @param {TileRotation | number} scenarioRotation
 */
export function logicalToDisplayCoord(coord, size, scenarioRotation) {
	const world = yawRotateCoord(coord, size, scenarioRotation);
	return yawInverseToGridCoord(world, size, 0);
}

/**
 * @param {MapCoord} coord
 * @param {number} size
 * @param {TileRotation | number} scenarioRotation
 */
export function displayToLogicalCoord(coord, size, scenarioRotation) {
	const world = yawRotateCoord(coord, size, 0);
	return yawInverseToGridCoord(world, size, scenarioRotation);
}

/**
 * @param {MapRect} rect
 * @param {number} size
 * @param {TileRotation | number} scenarioRotation
 */
export function rotateMapRect(rect, size, scenarioRotation) {
	const rotation = normalizeScenarioRotation(scenarioRotation);

	if (rotation === 0) {
		return { ...rect };
	}

	const corners = [
		{ x: rect.x, y: rect.y },
		{ x: rect.x + rect.width - 1, y: rect.y },
		{ x: rect.x, y: rect.y + rect.height - 1 },
		{ x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 }
	];

	const rotated = corners.map((corner) => logicalToDisplayCoord(corner, size, rotation));
	const xs = rotated.map((corner) => corner.x);
	const ys = rotated.map((corner) => corner.y);

	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	return {
		x: minX,
		y: minY,
		width: maxX - minX + 1,
		height: maxY - minY + 1
	};
}

/**
 * @param {GeneratedMap} map
 * @param {TileRotation | number} scenarioRotation
 * @returns {MapTile[][]}
 */
export function buildDisplayTiles(map, scenarioRotation) {
	const rotation = normalizeScenarioRotation(scenarioRotation);
	const size = map.width;

	/** @type {MapTile[][]} */
	const display = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

	for (let y = 0; y < size; y += 1) {
		for (let x = 0; x < size; x += 1) {
			const tile = map.tiles[y][x];
			const displayCoord = logicalToDisplayCoord({ x, y }, size, rotation);
			display[displayCoord.y][displayCoord.x] = tile;
		}
	}

	return display;
}

/**
 * @param {GeneratedMap} map
 * @param {TileRotation | number} scenarioRotation
 */
export function getDisplayBattleBounds(map, scenarioRotation) {
	return rotateMapRect(map.battleBounds, map.width, scenarioRotation);
}

/**
 * @param {MapTrack} track
 * @param {number} size
 * @param {TileRotation | number} scenarioRotation
 */
export function rotateMapTrack(track, size, scenarioRotation) {
	return {
		entry: logicalToDisplayCoord(track.entry, size, scenarioRotation),
		path: track.path.map((coord) => logicalToDisplayCoord(coord, size, scenarioRotation))
	};
}

/**
 * @param {GeneratedMap} map
 * @param {TileRotation | number} scenarioRotation
 */
export function getDisplayTracks(map, scenarioRotation) {
	return map.tracks.map((track) => rotateMapTrack(track, map.width, scenarioRotation));
}

/**
 * @param {GeneratedMap} map
 * @param {TileRotation | number} scenarioRotation
 * @param {MapCoord} displayCoord
 */
export function getLogicalTileAtDisplayCoord(map, scenarioRotation, displayCoord) {
	const logical = displayToLogicalCoord(displayCoord, map.width, scenarioRotation);
	return map.tiles[logical.y]?.[logical.x] ?? null;
}

/**
 * @param {GeneratedMap} map
 * @param {TileRotation | number} scenarioRotation
 */
export function withScenarioRotation(map, scenarioRotation) {
	return {
		...map,
		scenarioRotation: normalizeScenarioRotation(scenarioRotation)
	};
}

/**
 * @param {MapCoord} coord
 * @param {number} size
 * @param {number} tileWidth
 * @param {TileRotation | number} scenarioRotation
 */
export function projectGridCoordToIsoScreen(coord, size, tileWidth, scenarioRotation) {
	const tileHeight = tileWidth * 0.5;
	const world = yawRotateCoord(coord, size, scenarioRotation);
	return isoProject(world, tileWidth, tileHeight);
}

export { FACING_ORDER };
