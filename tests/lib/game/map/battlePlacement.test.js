import { describe, expect, it } from 'vitest';

import { createMapSeed, generateMap } from '$lib/game/map';
import { getBattleCombatantCoords } from '$lib/game/map/battlePlacement.js';

describe('game/map/battlePlacement', () => {
	it('places opponent on the north row and player on the south row of the arena', () => {
		const map = generateMap({ seed: createMapSeed(42) });
		const { player, opponent } = getBattleCombatantCoords(map);
		const { battleBounds } = map;
		const column = battleBounds.x + Math.floor(battleBounds.width / 2);

		expect(opponent).toEqual({ x: column, y: battleBounds.y });
		expect(player).toEqual({
			x: column,
			y: battleBounds.y + battleBounds.height - 1
		});
	});
});
