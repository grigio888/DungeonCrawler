import { expect } from 'vitest';

import { RARITY, SCALES } from '$lib/enums';
import { ITEM_CATEGORIES } from '$lib/items/enums';
import { EQUIPMENT_SLOTS } from '$lib/items/equipments/enums';

const EQUIPMENT_ID_PATTERN = /^i_e_\d+$/;
const RARITY_VALUES = Object.values(RARITY);
const SCALE_KEYS = Object.values(SCALES);
const EQUIPMENT_SLOT_VALUES = Object.values(EQUIPMENT_SLOTS);
const EQUIPMENT_CATEGORIES = [ITEM_CATEGORIES.ARMOR, ITEM_CATEGORIES.ACCESSORY];

/**
 * @param {unknown} definition
 * @param {string} [label]
 */
export function expectEquipmentDefinition(definition, label = 'equipment') {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const equipment = /** @type {Record<string, unknown>} */ (definition);

	expect(equipment.id, `${label}.id`).toEqual(expect.any(String));
	expect(equipment.id).toMatch(EQUIPMENT_ID_PATTERN);

	expect(equipment.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(equipment.name).length).toBeGreaterThan(0);

	expect(equipment.description, `${label}.description`).toEqual(expect.any(String));
	expect(String(equipment.description).length).toBeGreaterThan(0);

	expect(equipment.tier, `${label}.tier`).toEqual(expect.any(Number));
	expect(Number.isInteger(equipment.tier)).toBe(true);
	expect(/** @type {number} */ (equipment.tier)).toBeGreaterThanOrEqual(0);

	expect(EQUIPMENT_CATEGORIES, `${label}.category`).toContain(equipment.category);
	expect(EQUIPMENT_SLOT_VALUES, `${label}.slot`).toContain(equipment.slot);

	expect(RARITY_VALUES, `${label}.rarity`).toContain(equipment.rarity);

	expect(equipment.scales, `${label}.scales`).toEqual(expect.any(Object));
	const scales = /** @type {Record<string, unknown>} */ (equipment.scales);
	expect(Object.keys(scales).sort()).toEqual([...SCALE_KEYS].sort());
	for (const scale of SCALE_KEYS) {
		expect(scales[scale], `${label}.scales.${scale}`).toEqual(expect.any(Number));
		expect(scales[scale]).toBeGreaterThanOrEqual(0);
	}

	expect(equipment.defense, `${label}.defense`).toEqual(expect.any(Object));
	const defense = /** @type {{ min: unknown; max: unknown }} */ (equipment.defense);
	expect(defense.min, `${label}.defense.min`).toEqual(expect.any(Number));
	expect(defense.max, `${label}.defense.max`).toEqual(expect.any(Number));
	expect(defense.min).toBeGreaterThanOrEqual(0);
	expect(defense.max).toBeGreaterThanOrEqual(/** @type {number} */ (defense.min));
}

/**
 * @param {InstanceType<typeof import('$lib/items/equipments/factory.js').default>} equipment
 * @param {import('$lib/items/equipments/types.js').EquipmentDefinition} definition
 * @param {string} [label]
 */
export function expectEquipmentFactoryMatchesDefinition(
	equipment,
	definition,
	label = 'equipment'
) {
	expect(equipment.id, `${label}.id`).toBe(definition.id);
	expect(equipment.name, `${label}.name`).toBe(definition.name);
	expect(equipment.description, `${label}.description`).toBe(definition.description);
	expect(equipment.category, `${label}.category`).toBe(definition.category);
	expect(equipment.slot, `${label}.slot`).toBe(definition.slot);
	expect(equipment.rarity, `${label}.rarity`).toBe(definition.rarity);
	expect(equipment.scales, `${label}.scales`).toBe(definition.scales);
	expect(equipment.defense, `${label}.defense`).toEqual(definition.defense);
}
