/** Pixel size of one map square (isometric tile width). */
export const TILE_SIZE_PX = 64;

/** Isometric tile height ratio (2:1 dimetric — height is half the width). */
export const ISO_TILE_HEIGHT_RATIO = 0.5;

/** Extruded block height in px for the pseudo-3D tile body. */
export const ISO_TILE_EXTRUDE_PX = 8;

/** Default preview zoom in the debug map viewer (display only). */
export const DEFAULT_MAP_VIEW_SCALE = 1.5;

/** Minimum preview zoom multiplier. */
export const MAP_VIEW_SCALE_MIN = 1;

/** Maximum preview zoom multiplier. */
export const MAP_VIEW_SCALE_MAX = 3;

/** Battle arena is a square grid of this many tiles per side. */
export const BATTLE_GRID_SIZE = 6;

/** Tiles of composing terrain between the map edge and the battle grid. */
export const MAP_PADDING = 3;

/** Total map width/height in tiles (battle grid + padding on both sides). */
export const MAP_SIZE = BATTLE_GRID_SIZE + MAP_PADDING * 2;

/** Minimum number of tracks from the map edge to the battle grid. */
export const MIN_TRACK_COUNT = 2;

/** Track paths are this many tiles wide. */
export const TRACK_WIDTH = 2;

/** Number of quarter-turn steps per full rotation. */
export const TILE_ROTATION_COUNT = 4;

/** Degrees added per rotation step. */
export const TILE_ROTATION_STEP_DEG = 360 / TILE_ROTATION_COUNT;
