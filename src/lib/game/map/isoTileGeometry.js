/**
 * Isometric tile face geometry (2:1 dimetric, anchor at the south vertex).
 * @param {number} tileWidth
 * @param {number} tileHeight
 * @param {number} extrudeHeight
 */
export function getIsoTileFaces(tileWidth, tileHeight, extrudeHeight) {
	const halfW = tileWidth / 2;

	return {
		top: [
			{ x: 0, y: -tileHeight },
			{ x: halfW, y: -tileHeight / 2 },
			{ x: 0, y: 0 },
			{ x: -halfW, y: -tileHeight / 2 }
		],
		left: [
			{ x: -halfW, y: -tileHeight / 2 },
			{ x: 0, y: 0 },
			{ x: 0, y: extrudeHeight },
			{ x: -halfW, y: -tileHeight / 2 + extrudeHeight }
		],
		right: [
			{ x: halfW, y: -tileHeight / 2 },
			{ x: 0, y: 0 },
			{ x: 0, y: extrudeHeight },
			{ x: halfW, y: -tileHeight / 2 + extrudeHeight }
		],
		centerX: 0,
		centerY: -tileHeight / 2
	};
}

/**
 * @param {{ x: number, y: number }[]} points
 */
export function pointsToSvgPath(points) {
	if (points.length === 0) {
		return '';
	}

	const [first, ...rest] = points;
	const lines = rest.map((point) => `L ${point.x} ${point.y}`).join(' ');
	return `M ${first.x} ${first.y} ${lines} Z`;
}

/**
 * @param {string} color
 * @param {number} amount
 */
export function shadeHexColor(color, amount) {
	return `color-mix(in srgb, ${color} ${100 - amount}%, black)`;
}

/**
 * @param {string} color
 * @param {number} amount
 */
export function tintHexColor(color, amount) {
	return `color-mix(in srgb, ${color} ${100 - amount}%, white)`;
}
