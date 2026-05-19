import {
	ISO_TILE_EXTRUDE_PX,
	ISO_TILE_HEIGHT_RATIO,
	TILE_SIZE_PX
} from '$lib/core/constants/map.js';
import { FACING_ORDER } from '$lib/core/constants/sprites.js';
import { normalizeTileRotation } from './tile.js';

/** @typedef {import('./types.js').TileRotation} TileRotation */
/** @typedef {import('./types.js').MapCoord} MapCoord */
/** @typedef {import('./types.js').GeneratedMap} GeneratedMap */
/** @typedef {import('./types.js').MapTile} MapTile */

/**
 * @typedef {{
 *   rx: number,
 *   rz: number
 * }} IsoWorldCoord
 */

/**
 * @typedef {{
 *   tile: MapTile,
 *   screenX: number,
 *   screenY: number,
 *   depth: number,
 *   rx: number,
 *   rz: number
 * }} IsoTileLayoutEntry
 */

/**
 * @typedef {{
 *   entries: IsoTileLayoutEntry[],
 *   stageWidth: number,
 *   stageHeight: number,
 *   offsetX: number,
 *   offsetY: number,
 *   tileWidth: number,
 *   tileHeight: number,
 *   extrudeHeight: number
 * }} IsoTileLayout
 */

/**
 * @param {number} size
 */
export function getMapCenter(size) {
	return {
		cx: (size - 1) / 2,
		cz: (size - 1) / 2
	};
}

/**
 * Yaw rotation on the ground plane (Y axis in 3D space).
 * @param {MapCoord} coord
 * @param {number} size
 * @param {TileRotation | number} scenarioRotation
 */
export function yawRotateCoord(coord, size, scenarioRotation) {
	const yaw = normalizeTileRotation(scenarioRotation);
	const { cx, cz } = getMapCenter(size);
	const dx = coord.x - cx;
	const dz = coord.y - cz;

	if (yaw === 0) {
		return { rx: dx, rz: dz };
	}

	if (yaw === 1) {
		return { rx: -dz, rz: dx };
	}

	if (yaw === 2) {
		return { rx: -dx, rz: -dz };
	}

	return { rx: dz, rz: -dx };
}

/**
 * Inverse of {@link yawRotateCoord} — returns grid indices.
 * @param {IsoWorldCoord} world
 * @param {number} size
 * @param {TileRotation | number} scenarioRotation
 */
export function yawInverseToGridCoord(world, size, scenarioRotation) {
	const yaw = normalizeTileRotation(scenarioRotation);
	const { cx, cz } = getMapCenter(size);
	let dx = world.rx;
	let dz = world.rz;

	if (yaw === 1) {
		dx = world.rz;
		dz = -world.rx;
	} else if (yaw === 2) {
		dx = -world.rx;
		dz = -world.rz;
	} else if (yaw === 3) {
		dx = -world.rz;
		dz = world.rx;
	}

	return {
		x: Math.round(dx + cx),
		y: Math.round(dz + cz)
	};
}

/**
 * @param {IsoWorldCoord} world
 * @param {number} tileWidth
 * @param {number} tileHeight
 */
export function isoProject(world, tileWidth, tileHeight) {
	return {
		x: (world.rx - world.rz) * (tileWidth / 2),
		y: (world.rx + world.rz) * (tileHeight / 2)
	};
}

/**
 * @param {GeneratedMap} map
 * @param {TileRotation | number} [scenarioRotation]
 */
export function buildIsoTileLayout(map, scenarioRotation = map.scenarioRotation ?? 0) {
	const yaw = normalizeTileRotation(scenarioRotation);
	const tileWidth = map.tileSizePx ?? TILE_SIZE_PX;
	const tileHeight = tileWidth * ISO_TILE_HEIGHT_RATIO;
	const extrudeHeight = ISO_TILE_EXTRUDE_PX;

	/** @type {IsoTileLayoutEntry[]} */
	const entries = [];

	for (const row of map.tiles) {
		for (const tile of row) {
			const world = yawRotateCoord(tile, map.width, yaw);
			const projected = isoProject(world, tileWidth, tileHeight);

			entries.push({
				tile,
				screenX: projected.x,
				screenY: projected.y,
				depth: world.rx + world.rz,
				rx: world.rx,
				rz: world.rz
			});
		}
	}

	entries.sort((left, right) => left.depth - right.depth);

	const padding = tileWidth;
	const xs = entries.map((entry) => entry.screenX);
	const ys = entries.map((entry) => entry.screenY);
	const minX = Math.min(...xs) - tileWidth / 2;
	const maxX = Math.max(...xs) + tileWidth / 2;
	const minY = Math.min(...ys) - tileHeight;
	const maxY = Math.max(...ys) + extrudeHeight;

	return {
		entries,
		stageWidth: maxX - minX + padding * 2,
		stageHeight: maxY - minY + padding * 2,
		offsetX: -minX + padding,
		offsetY: -minY + padding,
		tileWidth,
		tileHeight,
		extrudeHeight
	};
}

/**
 * @param {TileRotation | number} scenarioRotation
 */
export function getScenarioFacing(scenarioRotation) {
	return FACING_ORDER[normalizeTileRotation(scenarioRotation)];
}

/**
 * @param {TileRotation | number} scenarioRotation
 */
export function getScenarioFacingLabel(scenarioRotation) {
	return getScenarioFacing(scenarioRotation).toUpperCase();
}

export { ISO_TILE_EXTRUDE_PX, ISO_TILE_HEIGHT_RATIO, TILE_SIZE_PX };
