import { describe, expect, it } from 'vitest';

import { createMapSeed, generateMap } from '$lib/game/map';
import { getBattleCombatantCoords } from '$lib/game/map/battlePlacement.js';

describe('game/map/battlePlacement', () => {
	it('places player on the left and opponent on the right of common ground', () => {
		const map = generateMap({ seed: createMapSeed(42) });
		const { player, opponent } = getBattleCombatantCoords(map);
		const { battleBounds } = map;

		expect(player.x).toBe(battleBounds.x + 1);
		expect(opponent.x).toBe(battleBounds.x + battleBounds.width - 2);
		expect(player.y).toBe(opponent.y);
		expect(player.y).toBeGreaterThanOrEqual(battleBounds.y);
		expect(player.y).toBeLessThan(battleBounds.y + battleBounds.height);
	});
});
