/** @typedef {(typeof TERRAIN_ROLE)[keyof typeof TERRAIN_ROLE]} TerrainRole */

/** Terrain tile roles used when composing a battle map. */
export const TERRAIN_ROLE = /** @type {const} */ ({
	/** Flat arena tiles where combat takes place. */
	COMMON: 'common',
	/** Decorative surrounding tiles (grass, dirt, rock, etc.). */
	COMPOSE: 'compose',
	/** Walkable paths that connect the map edge to the battle grid. */
	TRACK: 'track'
});
