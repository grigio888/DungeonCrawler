import { describe, expect, it } from 'vitest';

import WEAPONS from '$lib/content/items/weapons';
import WeaponFactory from '$lib/content/items/weapons/factory';

import { expectWeaponFactoryMatchesDefinition } from './validateDefinition.js';

describe('weapons/factory', () => {
	it('requires a weapon id', () => {
		expect(() => new WeaponFactory()).toThrow('Weapon ID is required');
		expect(() => new WeaponFactory('')).toThrow('Weapon ID is required');
	});

	it('rejects unknown weapon ids', () => {
		expect(() => new WeaponFactory('i_w_999')).toThrow('Invalid weapon ID');
	});

	it.each(Object.entries(WEAPONS))(
		'[%s] constructs from weapons index and matches definition',
		(registryKey, definition) => {
			expect(registryKey).toBe(definition.id);

			const weapon = new WeaponFactory(registryKey);

			expectWeaponFactoryMatchesDefinition(weapon, definition, registryKey);
		}
	);
});
