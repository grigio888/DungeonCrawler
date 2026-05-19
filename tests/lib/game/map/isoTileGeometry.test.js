import { describe, expect, it } from 'vitest';

import {
	ISO_TILE_EXTRUDE_PX,
	ISO_TILE_HEIGHT_RATIO,
	TILE_SIZE_PX
} from '$lib/core/constants/map.js';
import { getIsoTileFaces, pointsToSvgPath } from '$lib/game/map/isoTileGeometry.js';

const tileHeight = TILE_SIZE_PX * ISO_TILE_HEIGHT_RATIO;

describe('game/map/isoTileGeometry', () => {
	it('builds closed paths for all tile faces', () => {
		const faces = getIsoTileFaces(TILE_SIZE_PX, tileHeight, ISO_TILE_EXTRUDE_PX);

		expect(pointsToSvgPath(faces.top)).toMatch(/^M .* Z$/);
		expect(pointsToSvgPath(faces.left)).toMatch(/^M .* Z$/);
		expect(pointsToSvgPath(faces.right)).toMatch(/^M .* Z$/);
	});

	it('anchors the south tip at the origin', () => {
		const faces = getIsoTileFaces(TILE_SIZE_PX, tileHeight, ISO_TILE_EXTRUDE_PX);
		const southPoints = [...faces.top, ...faces.left, ...faces.right].filter(
			(point) => point.x === 0 && point.y === 0
		);

		expect(southPoints.length).toBeGreaterThan(0);
	});

	it('places the face center above the anchor', () => {
		const faces = getIsoTileFaces(TILE_SIZE_PX, tileHeight, ISO_TILE_EXTRUDE_PX);
		expect(faces.centerX).toBe(0);
		expect(faces.centerY).toBe(-tileHeight / 2);
	});
});
