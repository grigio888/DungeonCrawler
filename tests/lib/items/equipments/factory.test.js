import { describe, expect, it } from 'vitest';

import EQUIPMENTS from '$lib/items/equipments';
import EquipmentFactory from '$lib/items/equipments/factory';

import { expectEquipmentFactoryMatchesDefinition } from './validateDefinition.js';

describe('equipments/factory', () => {
	it('requires an equipment id', () => {
		expect(() => new EquipmentFactory()).toThrow('Equipment ID is required');
		expect(() => new EquipmentFactory('')).toThrow('Equipment ID is required');
	});

	it('rejects unknown equipment ids', () => {
		expect(() => new EquipmentFactory('i_e_999')).toThrow('Invalid equipment ID');
	});

	it.each(Object.entries(EQUIPMENTS))(
		'[%s] constructs from equipments index and matches definition',
		(registryKey, definition) => {
			expect(registryKey).toBe(definition.id);

			const equipment = new EquipmentFactory(registryKey);

			expectEquipmentFactoryMatchesDefinition(equipment, definition, registryKey);
		}
	);
});
