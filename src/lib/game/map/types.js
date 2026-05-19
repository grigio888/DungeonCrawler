/**
 * @typedef {import('$lib/content/terrain/types.js').TerrainId} TerrainId
 */

/**
 * @typedef {{ x: number, y: number }} MapCoord
 */

/**
 * @typedef {{
 *   x: number,
 *   y: number,
 *   width: number,
 *   height: number
 * }} MapRect
 */

/** @typedef {0 | 1 | 2 | 3} TileRotation */

/**
 * @typedef {{
 *   x: number,
 *   y: number,
 *   terrainId: TerrainId
 * }} MapTile
 */

/**
 * @typedef {{
 *   entry: MapCoord,
 *   path: MapCoord[]
 * }} MapTrack
 */

/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   tileSizePx: number,
 *   scenarioRotation: TileRotation,
 *   tiles: MapTile[][],
 *   battleBounds: MapRect,
 *   tracks: MapTrack[]
 * }} GeneratedMap
 */

/**
 * @typedef {{
 *   seed?: number
 * }} GenerateMapOptions
 */

export {};
