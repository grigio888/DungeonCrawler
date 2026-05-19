import { describe, expect, it } from 'vitest';

import TERRAIN, { Terrain } from '$lib/content/terrain';

import { expectTerrainDefinition, expectTerrainFactoryMatchesDefinition } from './validateDefinition.js';

describe('terrain/index', () => {
	it('registers terrain types', () => {
		expect(Object.keys(TERRAIN).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(TERRAIN))('[%s] registry key matches definition id', (key, definition) => {
		expect(key).toBe(definition.id);
	});

	it.each(Object.values(TERRAIN))('$id matches the expected structure', (definition) => {
		expectTerrainDefinition(definition, definition.id);
	});

	it('constructs Terrain from id', () => {
		const terrain = new Terrain('t_001');
		expect(terrain.id).toBe('t_001');
		expect(terrain.name).toBe(TERRAIN.t_001.name);
	});

	it.each(Object.entries(TERRAIN))(
		'[%s] constructs from terrain index and matches definition',
		(registryKey, definition) => {
			expect(registryKey).toBe(definition.id);
			const terrain = new Terrain(registryKey);
			expectTerrainFactoryMatchesDefinition(terrain, definition, registryKey);
		}
	);
});
