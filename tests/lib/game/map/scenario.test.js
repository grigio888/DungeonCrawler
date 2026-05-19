import { describe, expect, it } from 'vitest';

import { ISO_TILE_HEIGHT_RATIO, TILE_SIZE_PX } from '$lib/core/constants/map.js';
import {
	buildDisplayTiles,
	buildIsoTileLayout,
	generateMap,
	getDisplayTracks,
	getScenarioFacing,
	isoProject,
	logicalToDisplayCoord,
	displayToLogicalCoord,
	withScenarioRotation,
	yawInverseToGridCoord,
	yawRotateCoord
} from '$lib/game/map';
import { FACING } from '$lib/core/enum/sprites.js';

const tileHeight = TILE_SIZE_PX * ISO_TILE_HEIGHT_RATIO;

describe('game/map/scenario', () => {
	const map = generateMap({ seed: 42 });
	const size = map.width;

	it('round-trips logical and display coordinates for every camera yaw', () => {
		for (let rotation = 0; rotation < 4; rotation += 1) {
			for (let y = 0; y < size; y += 1) {
				for (let x = 0; x < size; x += 1) {
					const display = logicalToDisplayCoord({ x, y }, size, rotation);
					const logical = displayToLogicalCoord(display, size, rotation);
					expect(logical).toEqual({ x, y });
				}
			}
		}
	});

	it('round-trips yaw world coordinates for every camera yaw', () => {
		for (let rotation = 0; rotation < 4; rotation += 1) {
			for (let y = 0; y < size; y += 1) {
				for (let x = 0; x < size; x += 1) {
					const world = yawRotateCoord({ x, y }, size, rotation);
					const grid = yawInverseToGridCoord(world, size, rotation);
					expect(grid).toEqual({ x, y });
				}
			}
		}
	});

	it('builds a full display grid without gaps', () => {
		for (let rotation = 0; rotation < 4; rotation += 1) {
			const display = buildDisplayTiles(map, rotation);

			expect(display).toHaveLength(size);
			for (const row of display) {
				expect(row).toHaveLength(size);
				for (const tile of row) {
					expect(tile).toBeTruthy();
				}
			}
		}
	});

	it('stores scenario rotation on the map', () => {
		const rotated = withScenarioRotation(map, 2);
		expect(rotated.scenarioRotation).toBe(2);
		expect(map.scenarioRotation).toBe(0);
	});

	it('maps camera yaw to RO-style facings', () => {
		expect(getScenarioFacing(0)).toBe(FACING.SW);
		expect(getScenarioFacing(1)).toBe(FACING.SE);
		expect(getScenarioFacing(2)).toBe(FACING.NE);
		expect(getScenarioFacing(3)).toBe(FACING.NW);
	});

	it('rotates track coordinates with the scenario', () => {
		const tracks = getDisplayTracks(withScenarioRotation(map, 1), 1);
		expect(tracks).toHaveLength(map.tracks.length);
		expect(tracks[0]?.entry).not.toEqual(map.tracks[0]?.entry);
	});
});

describe('game/map/isometric', () => {
	const map = generateMap({ seed: 42 });

	it('lays out every tile in isometric space', () => {
		const layout = buildIsoTileLayout(map, 0);
		expect(layout.entries).toHaveLength(map.width * map.height);
		expect(layout.stageWidth).toBeGreaterThan(0);
		expect(layout.stageHeight).toBeGreaterThan(0);
	});

	it('changes screen positions when the camera yaws', () => {
		const base = buildIsoTileLayout(map, 0);
		const rotated = buildIsoTileLayout(map, 1);
		const baseFirst = base.entries[0];
		const rotatedFirst = rotated.entries.find(
			(entry) => entry.tile.x === baseFirst.tile.x && entry.tile.y === baseFirst.tile.y
		);

		expect(rotatedFirst).toBeDefined();
		expect(rotatedFirst?.screenX).not.toBe(baseFirst.screenX);
		expect(rotatedFirst?.screenY).not.toBe(baseFirst.screenY);
	});

	it('projects world coords to a 2:1 isometric screen space', () => {
		expect(isoProject({ rx: 0, rz: 0 }, TILE_SIZE_PX, tileHeight)).toEqual({ x: 0, y: 0 });
		expect(isoProject({ rx: 1, rz: 0 }, TILE_SIZE_PX, tileHeight)).toEqual({
			x: TILE_SIZE_PX / 2,
			y: tileHeight / 2
		});
		expect(isoProject({ rx: 0, rz: 1 }, TILE_SIZE_PX, tileHeight)).toEqual({
			x: -TILE_SIZE_PX / 2,
			y: tileHeight / 2
		});
	});

	it('sorts back-to-front by depth', () => {
		const layout = buildIsoTileLayout(map, 0);
		for (let index = 1; index < layout.entries.length; index += 1) {
			expect(layout.entries[index].depth).toBeGreaterThanOrEqual(layout.entries[index - 1].depth);
		}
	});
});
