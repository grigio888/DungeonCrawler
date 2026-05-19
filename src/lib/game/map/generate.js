import TERRAIN from '$lib/content/terrain/registry.js';
import { getDefaultTerrainIdForRole, getTerrainIdsByRole } from '$lib/content/terrain/factory.js';
import {
	BATTLE_GRID_SIZE,
	MAP_PADDING,
	MAP_SIZE,
	MIN_TRACK_COUNT,
	TILE_SIZE_PX,
	TRACK_WIDTH,
	DEFAULT_MAP_VIEW_SCALE,
	MAP_VIEW_SCALE_MIN,
	MAP_VIEW_SCALE_MAX
} from '$lib/core/constants/map.js';
import { TERRAIN_ROLE } from '$lib/core/enum/terrain.js';
import { pickRandomTracks } from './trackPath.js';

/** @typedef {import('./types.js').GenerateMapOptions} GenerateMapOptions */
/** @typedef {import('./types.js').GeneratedMap} GeneratedMap */
/** @typedef {import('./types.js').MapCoord} MapCoord */

/**
 * Mulberry32 PRNG — deterministic when seeded.
 * @param {number} seed
 */
function createRng(seed) {
	let state = seed >>> 0;

	return () => {
		state += 0x6d2b79f5;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * @param {number} seed
 */
export function createMapSeed(seed = Date.now()) {
	return seed >>> 0;
}

/**
 * @returns {import('./types.js').MapRect}
 */
export function getBattleBounds() {
	return {
		x: MAP_PADDING,
		y: MAP_PADDING,
		width: BATTLE_GRID_SIZE,
		height: BATTLE_GRID_SIZE
	};
}

/**
 * @param {() => number} rng
 * @param {readonly string[]} composeTerrainIds
 */
function pickComposeTerrainId(rng, composeTerrainIds) {
	const index = Math.floor(rng() * composeTerrainIds.length);
	return composeTerrainIds[index];
}

/**
 * @param {GenerateMapOptions} [options]
 * @returns {GeneratedMap}
 */
export function generateMap(options = {}) {
	const seed = createMapSeed(options.seed ?? Date.now());
	const rng = createRng(seed);
	const battleBounds = getBattleBounds();
	const commonGroundId = getDefaultTerrainIdForRole(TERRAIN_ROLE.COMMON);
	const trackId = getDefaultTerrainIdForRole(TERRAIN_ROLE.TRACK);
	const composeTerrainIds = getTerrainIdsByRole(TERRAIN_ROLE.COMPOSE);

	if (!(commonGroundId in TERRAIN)) {
		throw new Error(`Missing common ground terrain: ${commonGroundId}`);
	}

	if (!(trackId in TERRAIN)) {
		throw new Error(`Missing track terrain: ${trackId}`);
	}

	if (composeTerrainIds.length === 0) {
		throw new Error('At least one composing terrain type is required.');
	}

	/** @type {import('./types.js').MapTile[][]} */
	const tiles = [];

	for (let y = 0; y < MAP_SIZE; y += 1) {
		/** @type {import('./types.js').MapTile[]} */
		const row = [];

		for (let x = 0; x < MAP_SIZE; x += 1) {
			const inBattle =
				x >= battleBounds.x &&
				x < battleBounds.x + battleBounds.width &&
				y >= battleBounds.y &&
				y < battleBounds.y + battleBounds.height;

			let terrainId = pickComposeTerrainId(rng, composeTerrainIds);

			if (inBattle) {
				terrainId = commonGroundId;
			}

			row.push({ x, y, terrainId });
		}

		tiles.push(row);
	}

	const tracks = pickRandomTracks(rng);

	for (const track of tracks) {
		for (const coord of track.path) {
			tiles[coord.y][coord.x].terrainId = trackId;
		}
	}

	return {
		width: MAP_SIZE,
		height: MAP_SIZE,
		tileSizePx: TILE_SIZE_PX,
		scenarioRotation: 0,
		tiles,
		battleBounds,
		tracks
	};
}

/**
 * @param {GeneratedMap} map
 * @param {MapCoord} coord
 */
export function isBattleTile(map, coord) {
	const { battleBounds } = map;
	return (
		coord.x >= battleBounds.x &&
		coord.x < battleBounds.x + battleBounds.width &&
		coord.y >= battleBounds.y &&
		coord.y < battleBounds.y + battleBounds.height
	);
}

/**
 * @param {GeneratedMap} map
 */
export function countTilesByRole(map) {
	/** @type {Record<string, number>} */
	const counts = {};

	for (const row of map.tiles) {
		for (const tile of row) {
			const role = TERRAIN[tile.terrainId]?.role ?? 'unknown';
			counts[role] = (counts[role] ?? 0) + 1;
		}
	}

	return counts;
}

export { BATTLE_GRID_SIZE, MAP_PADDING, MAP_SIZE, MIN_TRACK_COUNT, TILE_SIZE_PX, TRACK_WIDTH, DEFAULT_MAP_VIEW_SCALE, MAP_VIEW_SCALE_MIN, MAP_VIEW_SCALE_MAX };
