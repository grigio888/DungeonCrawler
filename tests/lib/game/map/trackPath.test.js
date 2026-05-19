import { describe, expect, it } from 'vitest';

import {
	buildRandomCenterline,
	buildRandomTrack,
	expandCenterlineToTrack,
	getTrackBattleBounds,
	isTrackPathConnected,
	touchesBattleBorder
} from '$lib/game/map/trackPath.js';

describe('game/map/trackPath', () => {
	const battleBounds = getTrackBattleBounds();

	function mockRng(values) {
		let index = 0;
		return () => {
			const value = values[index] ?? values[values.length - 1] ?? 0;
			index += 1;
			return value;
		};
	}

	it('expands a centerline to a connected two-tile-wide path', () => {
		const centerline = [
			{ x: 5, y: 0 },
			{ x: 5, y: 1 },
			{ x: 6, y: 2 },
			{ x: 6, y: 3 }
		];
		const path = expandCenterlineToTrack(centerline, battleBounds);

		expect(path.length).toBeGreaterThanOrEqual(centerline.length);
		expect(isTrackPathConnected(path)).toBe(true);
	});

	it('builds a connected random track that reaches the battle grid', () => {
		const track = buildRandomTrack('north', mockRng([0.1, 0.7, 0.1, 0.7, 0.1, 0.2, 0.1]));

		expect(track.path.length).toBeGreaterThan(0);
		expect(isTrackPathConnected(track.path)).toBe(true);
		expect(track.path.some((coord) => touchesBattleBorder(coord, battleBounds))).toBe(true);
	});

	it('can curve a centerline with lateral rolls', () => {
		const centerline = buildRandomCenterline(
			{ x: 4, y: 0 },
			{ dx: 0, dy: 1 },
			mockRng([0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7]),
			battleBounds
		);

		expect(centerline.length).toBeGreaterThan(1);
		expect(new Set(centerline.map((coord) => coord.x)).size).toBeGreaterThan(1);
	});
});
