import { describe, expect, it } from 'vitest';

import WEAPONS from '$lib/content/items/weapons';

import { expectWeaponDefinition } from './validateDefinition.js';

describe('weapons/index', () => {
	it('registers at least one weapon', () => {
		expect(Object.keys(WEAPONS).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(WEAPONS))('[%s] registry key matches definition id', (key, definition) => {
		expect(key).toBe(definition.id);
	});

	it.each(Object.values(WEAPONS))('$id matches the expected weapon structure', (definition) => {
		expectWeaponDefinition(definition, definition.id);
	});
});
