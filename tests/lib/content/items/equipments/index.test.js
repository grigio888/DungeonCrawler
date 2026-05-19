import { describe, expect, it } from 'vitest';

import EQUIPMENTS from '$lib/content/items/equipments';

import { expectEquipmentDefinition } from './validateDefinition.js';

describe('equipments/index', () => {
	it('registers at least one equipment', () => {
		expect(Object.keys(EQUIPMENTS).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(EQUIPMENTS))(
		'[%s] registry key matches definition id',
		(key, definition) => {
			expect(key).toBe(definition.id);
		}
	);

	it.each(Object.values(EQUIPMENTS))(
		'$id matches the expected equipment structure',
		(definition) => {
			expectEquipmentDefinition(definition, definition.id);
		}
	);
});
