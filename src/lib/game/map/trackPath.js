import {
	BATTLE_GRID_SIZE,
	MAP_PADDING,
	MAP_SIZE,
	MIN_TRACK_COUNT,
	TRACK_WIDTH
} from '$lib/core/constants/map.js';

/** @typedef {import('./types.js').MapCoord} MapCoord */
/** @typedef {import('./types.js').MapRect} MapRect */
/** @typedef {import('./types.js').MapTrack} MapTrack */
/** @typedef {'north' | 'south' | 'east' | 'west'} MapEdge */

/** @typedef {{ dx: number, dy: number }} MapDirection */

const CARDINAL_MOVES = [
	{ x: 0, y: 1 },
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: -1, y: 0 }
];

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

/**
 * @param {MapCoord} coord
 */
function coordKey(coord) {
	return `${coord.x},${coord.y}`;
}

/**
 * @returns {MapRect}
 */
export function getTrackBattleBounds() {
	return {
		x: MAP_PADDING,
		y: MAP_PADDING,
		width: BATTLE_GRID_SIZE,
		height: BATTLE_GRID_SIZE
	};
}

/**
 * @param {MapCoord} coord
 * @param {MapRect} battleBounds
 */
export function isInsideBattle(coord, battleBounds) {
	return (
		coord.x >= battleBounds.x &&
		coord.x < battleBounds.x + battleBounds.width &&
		coord.y >= battleBounds.y &&
		coord.y < battleBounds.y + battleBounds.height
	);
}

/**
 * @param {MapCoord} coord
 * @param {MapRect} battleBounds
 */
export function isValidTrackTile(coord, battleBounds) {
	if (coord.x < 0 || coord.y < 0 || coord.x >= MAP_SIZE || coord.y >= MAP_SIZE) {
		return false;
	}

	return !isInsideBattle(coord, battleBounds);
}

/**
 * @param {MapCoord} coord
 * @param {MapRect} battleBounds
 */
export function touchesBattleBorder(coord, battleBounds) {
	if (isInsideBattle(coord, battleBounds)) {
		return false;
	}

	for (const move of CARDINAL_MOVES) {
		const neighbor = { x: coord.x + move.x, y: coord.y + move.y };
		if (isInsideBattle(neighbor, battleBounds)) {
			return true;
		}
	}

	return false;
}

/**
 * @param {MapEdge} edge
 */
function getPrimaryDirection(edge) {
	if (edge === 'north') {
		return { dx: 0, dy: 1 };
	}

	if (edge === 'south') {
		return { dx: 0, dy: -1 };
	}

	if (edge === 'west') {
		return { dx: 1, dy: 0 };
	}

	return { dx: -1, dy: 0 };
}

/**
 * @param {MapDirection} direction
 * @param {MapDirection} move
 */
function isForwardMove(direction, move) {
	return move.x === direction.dx && move.y === direction.dy;
}

/**
 * @param {MapDirection} direction
 * @param {MapDirection} move
 */
function isLateralMove(direction, move) {
	if (direction.dx !== 0) {
		return move.y !== 0;
	}

	return move.x !== 0;
}

/**
 * @param {MapCoord[]} line
 * @param {number} index
 */
function getWidthOffset(line, index) {
	const prev = line[index - 1] ?? line[index];
	const next = line[index + 1] ?? line[index];
	let dx = next.x - prev.x;
	let dy = next.y - prev.y;

	if (dx === 0 && dy === 0) {
		dx = next.x - line[index].x;
		dy = next.y - line[index].y;
	}

	dx = clamp(dx, -1, 1);
	dy = clamp(dy, -1, 1);

	if (dx !== 0) {
		return { x: 0, y: dx > 0 ? 1 : -1 };
	}

	if (dy !== 0) {
		return { x: dy > 0 ? -1 : 1, y: 0 };
	}

	return { x: 1, y: 0 };
}

/**
 * @param {Map<string, MapCoord>} tiles
 * @param {MapCoord} coord
 * @param {MapRect} battleBounds
 */
function addValidTile(tiles, coord, battleBounds) {
	if (!isValidTrackTile(coord, battleBounds)) {
		return;
	}

	tiles.set(coordKey(coord), coord);
}

/**
 * @param {MapCoord[]} centerline
 * @param {MapRect} battleBounds
 */
export function expandCenterlineToTrack(centerline, battleBounds) {
	/** @type {Map<string, MapCoord>} */
	const tiles = new Map();

	for (let index = 0; index < centerline.length; index += 1) {
		const point = centerline[index];
		const offset = getWidthOffset(centerline, index);

		addValidTile(tiles, point, battleBounds);
		addValidTile(tiles, { x: point.x + offset.x, y: point.y + offset.y }, battleBounds);

		if (index > 0) {
			const previousOffset = getWidthOffset(centerline, index - 1);
			if (previousOffset.x !== offset.x || previousOffset.y !== offset.y) {
				addValidTile(
					tiles,
					{ x: point.x + previousOffset.x, y: point.y + previousOffset.y },
					battleBounds
				);
			}
		}
	}

	return [...tiles.values()];
}

/**
 * @param {MapEdge} edge
 * @param {() => number} rng
 */
function pickEntrySpan(edge, rng) {
	if (edge === 'north') {
		const startX = Math.floor(rng() * (MAP_SIZE - TRACK_WIDTH + 1));
		return {
			entry: { x: startX, y: 0 },
			center: { x: startX, y: 0 },
			initialTiles: [
				{ x: startX, y: 0 },
				{ x: startX + 1, y: 0 }
			]
		};
	}

	if (edge === 'south') {
		const startX = Math.floor(rng() * (MAP_SIZE - TRACK_WIDTH + 1));
		return {
			entry: { x: startX, y: MAP_SIZE - 1 },
			center: { x: startX, y: MAP_SIZE - 1 },
			initialTiles: [
				{ x: startX, y: MAP_SIZE - 1 },
				{ x: startX + 1, y: MAP_SIZE - 1 }
			]
		};
	}

	if (edge === 'west') {
		const startY = Math.floor(rng() * (MAP_SIZE - TRACK_WIDTH + 1));
		return {
			entry: { x: 0, y: startY },
			center: { x: 0, y: startY },
			initialTiles: [
				{ x: 0, y: startY },
				{ x: 0, y: startY + 1 }
			]
		};
	}

	const startY = Math.floor(rng() * (MAP_SIZE - TRACK_WIDTH + 1));
	return {
		entry: { x: MAP_SIZE - 1, y: startY },
		center: { x: MAP_SIZE - 1, y: startY },
		initialTiles: [
			{ x: MAP_SIZE - 1, y: startY },
			{ x: MAP_SIZE - 1, y: startY + 1 }
		]
	};
}

/**
 * @param {MapCoord} start
 * @param {MapDirection} primaryDir
 * @param {() => number} rng
 * @param {MapRect} battleBounds
 */
export function buildRandomCenterline(start, primaryDir, rng, battleBounds) {
	/** @type {MapCoord[]} */
	const line = [{ ...start }];
	/** @type {Set<string>} */
	const used = new Set([coordKey(start)]);

	let guard = 0;
	while (!touchesBattleBorder(line[line.length - 1], battleBounds) && guard < MAP_SIZE * MAP_SIZE) {
		const head = line[line.length - 1];
		/** @type {{ coord: MapCoord, move: MapDirection }[]} */
		const options = [];

		for (const move of CARDINAL_MOVES) {
			const next = { x: head.x + move.x, y: head.y + move.y };
			if (!isValidTrackTile(next, battleBounds)) continue;
			if (used.has(coordKey(next))) continue;
			options.push({ coord: next, move });
		}

		if (options.length === 0) {
			break;
		}

		const forward = options.filter((option) => isForwardMove(primaryDir, option.move));
		const lateral = options.filter((option) => isLateralMove(primaryDir, option.move));
		const roll = rng();

		let pool = options;
		if (roll < 0.55 && forward.length > 0) {
			pool = forward;
		} else if (roll < 0.85 && lateral.length > 0) {
			pool = lateral;
		}

		const picked = pool[Math.floor(rng() * pool.length)];
		line.push(picked.coord);
		used.add(coordKey(picked.coord));
		guard += 1;
	}

	return line;
}

/**
 * @param {MapEdge} edge
 * @param {number} offset
 * @param {MapRect} battleBounds
 */
function buildStraightTrackFallback(edge, offset, battleBounds) {
	const lastComposeIndex = MAP_PADDING - 1;
	const start = clamp(Math.floor(offset), 0, MAP_SIZE - TRACK_WIDTH);

	/** @type {MapCoord[]} */
	const path = [];

	if (edge === 'north') {
		for (let y = 0; y <= lastComposeIndex; y += 1) {
			for (let dx = 0; dx < TRACK_WIDTH; dx += 1) {
				path.push({ x: start + dx, y });
			}
		}
		return { entry: { x: start, y: 0 }, path };
	}

	if (edge === 'south') {
		for (let y = MAP_SIZE - 1; y >= battleBounds.y + battleBounds.height; y -= 1) {
			for (let dx = 0; dx < TRACK_WIDTH; dx += 1) {
				path.push({ x: start + dx, y });
			}
		}
		return { entry: { x: start, y: MAP_SIZE - 1 }, path };
	}

	if (edge === 'west') {
		for (let x = 0; x <= lastComposeIndex; x += 1) {
			for (let dy = 0; dy < TRACK_WIDTH; dy += 1) {
				path.push({ x, y: start + dy });
			}
		}
		return { entry: { x: 0, y: start }, path };
	}

	for (let x = MAP_SIZE - 1; x >= battleBounds.x + battleBounds.width; x -= 1) {
		for (let dy = 0; dy < TRACK_WIDTH; dy += 1) {
			path.push({ x, y: start + dy });
		}
	}

	return { entry: { x: MAP_SIZE - 1, y: start }, path };
}

/**
 * @param {MapCoord[]} path
 */
export function isTrackPathConnected(path) {
	if (path.length === 0) {
		return false;
	}

	/** @type {Set<string>} */
	const allowed = new Set(path.map(coordKey));
	/** @type {Set<string>} */
	const visited = new Set([coordKey(path[0])]);
	/** @type {MapCoord[]} */
	const queue = [path[0]];

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;

		for (const move of CARDINAL_MOVES) {
			const next = { x: current.x + move.x, y: current.y + move.y };
			const key = coordKey(next);
			if (!allowed.has(key) || visited.has(key)) continue;
			visited.add(key);
			queue.push(next);
		}
	}

	return visited.size === allowed.size;
}

/**
 * @param {MapEdge} edge
 * @param {() => number} rng
 */
export function buildRandomTrack(edge, rng) {
	const battleBounds = getTrackBattleBounds();
	const entrySpan = pickEntrySpan(edge, rng);
	const primaryDir = getPrimaryDirection(edge);
	const centerline = buildRandomCenterline(entrySpan.center, primaryDir, rng, battleBounds);

	/** @type {Map<string, MapCoord>} */
	const pathMap = new Map();

	for (const coord of entrySpan.initialTiles) {
		addValidTile(pathMap, coord, battleBounds);
	}

	for (const coord of expandCenterlineToTrack(centerline, battleBounds)) {
		addValidTile(pathMap, coord, battleBounds);
	}

	let path = [...pathMap.values()];

	if (path.length === 0 || !isTrackPathConnected(path)) {
		const battleCenterX = battleBounds.x + Math.floor(battleBounds.width / 2);
		const battleCenterY = battleBounds.y + Math.floor(battleBounds.height / 2);
		let offset = battleCenterX;

		if (edge === 'west' || edge === 'east') {
			offset = battleCenterY;
		}

		path = buildStraightTrackFallback(edge, offset, battleBounds).path;
	}

	const touchesBattle = path.some((coord) => touchesBattleBorder(coord, battleBounds));
	if (!touchesBattle) {
		const battleCenterX = battleBounds.x + Math.floor(battleBounds.width / 2);
		const battleCenterY = battleBounds.y + Math.floor(battleBounds.height / 2);
		let offset = battleCenterX;

		if (edge === 'west' || edge === 'east') {
			offset = battleCenterY;
		}

		path = buildStraightTrackFallback(edge, offset, battleBounds).path;
	}

	return {
		entry: entrySpan.entry,
		path
	};
}

/**
 * @param {() => number} rng
 */
export function pickRandomTracks(rng) {
	/** @type {MapEdge[]} */
	const edges = ['north', 'south', 'east', 'west'];
	/** @type {MapEdge[]} */
	const shuffled = [...edges];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(rng() * (index + 1));
		const temp = shuffled[index];
		shuffled[index] = shuffled[swapIndex];
		shuffled[swapIndex] = temp;
	}

	return shuffled.slice(0, MIN_TRACK_COUNT).map((edge) => buildRandomTrack(edge, rng));
}

export { MIN_TRACK_COUNT, TRACK_WIDTH };
