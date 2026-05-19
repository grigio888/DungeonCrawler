import { expect } from 'vitest';

import { TERRAIN_ROLE } from '$lib/core/enum/terrain.js';

const TERRAIN_ID_PATTERN = /^t_\d+$/;
const TERRAIN_ROLE_VALUES = Object.values(TERRAIN_ROLE);
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

/**
 * @param {unknown} definition
 * @param {string} [label]
 */
export function expectTerrainDefinition(definition, label = 'terrain') {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const terrain = /** @type {Record<string, unknown>} */ (definition);

	expect(terrain.id, `${label}.id`).toEqual(expect.any(String));
	expect(terrain.id).toMatch(TERRAIN_ID_PATTERN);

	expect(terrain.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(terrain.name).length).toBeGreaterThan(0);

	expect(terrain.description, `${label}.description`).toEqual(expect.any(String));
	expect(String(terrain.description).length).toBeGreaterThan(0);

	expect(TERRAIN_ROLE_VALUES, `${label}.role`).toContain(terrain.role);

	expect(terrain.color, `${label}.color`).toEqual(expect.any(String));
	expect(String(terrain.color)).toMatch(HEX_COLOR_PATTERN);
}

/**
 * @param {InstanceType<typeof import('$lib/content/terrain/factory.js').default>} terrain
 * @param {import('$lib/content/terrain/types.js').TerrainDefinition} definition
 * @param {string} [label]
 */
export function expectTerrainFactoryMatchesDefinition(terrain, definition, label = 'terrain') {
	expect(terrain.id, `${label}.id`).toBe(definition.id);
	expect(terrain.name, `${label}.name`).toBe(definition.name);
	expect(terrain.description, `${label}.description`).toBe(definition.description);
	expect(terrain.role, `${label}.role`).toBe(definition.role);
	expect(terrain.color, `${label}.color`).toBe(definition.color);
}
