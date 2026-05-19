import { describe, expect, it } from 'vitest';

import TERRAIN from '$lib/content/terrain/registry.js';
import {
	BATTLE_GRID_SIZE,
	MAP_SIZE,
	MIN_TRACK_COUNT,
	TILE_SIZE_PX,
	TRACK_WIDTH,
	countTilesByRole,
	generateMap,
	isBattleTile,
	isTrackPathConnected,
	normalizeTileRotation,
	tileRotationDegrees,
	touchesBattleBorder
} from '$lib/game/map';
import { TERRAIN_ROLE } from '$lib/core/enum/terrain.js';

describe('game/map/generate', () => {
	it('uses 64px tiles and a 12×12 grid with a 6×6 battle area', () => {
		const map = generateMap({ seed: 42 });

		expect(map.tileSizePx).toBe(TILE_SIZE_PX);
		expect(map.scenarioRotation).toBe(0);
		expect(map.width).toBe(MAP_SIZE);
		expect(map.height).toBe(MAP_SIZE);
		expect(map.tiles).toHaveLength(MAP_SIZE);
		expect(map.tiles[0]).toHaveLength(MAP_SIZE);
		expect(map.battleBounds.width).toBe(BATTLE_GRID_SIZE);
		expect(map.battleBounds.height).toBe(BATTLE_GRID_SIZE);
	});

	it('fills the battle grid with common ground', () => {
		const map = generateMap({ seed: 42 });
		const commonGroundId = Object.values(TERRAIN).find(
			(definition) => definition.role === TERRAIN_ROLE.COMMON
		)?.id;

		expect(commonGroundId).toBeDefined();

		for (let y = map.battleBounds.y; y < map.battleBounds.y + map.battleBounds.height; y += 1) {
			for (let x = map.battleBounds.x; x < map.battleBounds.x + map.battleBounds.width; x += 1) {
				expect(map.tiles[y][x].terrainId).toBe(commonGroundId);
			}
		}
	});

	it('uses multiple composing terrain types outside the battle grid', () => {
		const map = generateMap({ seed: 99 });
		const composeIds = new Set(
			Object.values(TERRAIN)
				.filter((definition) => definition.role === TERRAIN_ROLE.COMPOSE)
				.map((definition) => definition.id)
		);

		/** @type {Set<string>} */
		const usedComposeIds = new Set();

		for (const row of map.tiles) {
			for (const tile of row) {
				if (isBattleTile(map, tile)) continue;
				const terrainId = String(tile.terrainId);
				if (composeIds.has(terrainId)) {
					usedComposeIds.add(terrainId);
				}
			}
		}

		expect(usedComposeIds.size).toBeGreaterThan(1);
	});

	it('creates connected tracks from the map edge to the battle grid', () => {
		const map = generateMap({ seed: 42 });

		expect(map.tracks.length).toBeGreaterThanOrEqual(MIN_TRACK_COUNT);

		const trackId = Object.values(TERRAIN).find(
			(definition) => definition.role === TERRAIN_ROLE.TRACK
		)?.id;

		expect(trackId).toBeDefined();

		for (const track of map.tracks) {
			expect(track.path.length).toBeGreaterThanOrEqual(TRACK_WIDTH);
			expect(isTrackPathConnected(track.path)).toBe(true);
			expect(
				track.entry.x === 0 ||
					track.entry.y === 0 ||
					track.entry.x === MAP_SIZE - 1 ||
					track.entry.y === MAP_SIZE - 1
			).toBe(true);

			for (const coord of track.path) {
				expect(map.tiles[coord.y][coord.x].terrainId).toBe(trackId);
			}

			expect(track.path.some((coord) => touchesBattleBorder(coord, map.battleBounds))).toBe(true);
		}
	});

	it('can generate curved tracks for some seeds', () => {
		let foundCurved = false;

		for (let seed = 0; seed < 30; seed += 1) {
			const map = generateMap({ seed });
			for (const track of map.tracks) {
				const xs = new Set(track.path.map((coord) => coord.x));
				const ys = new Set(track.path.map((coord) => coord.y));
				if (xs.size > TRACK_WIDTH && ys.size > 1) {
					foundCurved = true;
					break;
				}
			}
			if (foundCurved) break;
		}

		expect(foundCurved).toBe(true);
	});

	it('is deterministic for the same seed', () => {
		const first = generateMap({ seed: 1234 });
		const second = generateMap({ seed: 1234 });

		expect(first.tiles.map((row) => row.map((tile) => tile.terrainId))).toEqual(
			second.tiles.map((row) => row.map((tile) => tile.terrainId))
		);
	});

	it('reports tile counts by terrain role', () => {
		const map = generateMap({ seed: 42 });
		const counts = countTilesByRole(map);

		expect(counts[TERRAIN_ROLE.COMMON]).toBe(BATTLE_GRID_SIZE * BATTLE_GRID_SIZE);
		expect(counts[TERRAIN_ROLE.TRACK]).toBeGreaterThan(0);
		expect(counts[TERRAIN_ROLE.COMPOSE]).toBeGreaterThan(0);
	});
});

describe('game/map/tile', () => {
	it('normalizes camera yaw to quarter turns', () => {
		expect(normalizeTileRotation(0)).toBe(0);
		expect(normalizeTileRotation(5)).toBe(1);
		expect(normalizeTileRotation(-1)).toBe(3);
	});

	it('converts camera yaw steps to degrees', () => {
		expect(tileRotationDegrees(0)).toBe(0);
		expect(tileRotationDegrees(1)).toBe(90);
		expect(tileRotationDegrees(3)).toBe(270);
	});
});
