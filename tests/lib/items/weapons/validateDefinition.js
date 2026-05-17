import { expect } from 'vitest';

import { RARITY, SCALES } from '$lib/enums';
import { ITEM_CATEGORIES } from '$lib/items/enums';

const WEAPON_ID_PATTERN = /^i_w_\d+$/;
const RARITY_VALUES = Object.values(RARITY);
const SCALE_KEYS = Object.values(SCALES);

/**
 * @param {unknown} definition
 * @param {string} [label]
 */
export function expectWeaponDefinition(definition, label = 'weapon') {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const weapon = /** @type {Record<string, unknown>} */ (definition);

	expect(weapon.id, `${label}.id`).toEqual(expect.any(String));
	expect(weapon.id).toMatch(WEAPON_ID_PATTERN);

	expect(weapon.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(weapon.name).length).toBeGreaterThan(0);

	expect(weapon.description, `${label}.description`).toEqual(expect.any(String));
	expect(String(weapon.description).length).toBeGreaterThan(0);

	expect(weapon.tier, `${label}.tier`).toEqual(expect.any(Number));
	expect(Number.isInteger(weapon.tier)).toBe(true);
	expect(/** @type {number} */ (weapon.tier)).toBeGreaterThanOrEqual(0);

	expect(weapon.category, `${label}.category`).toBe(ITEM_CATEGORIES.WEAPON);

	expect(RARITY_VALUES, `${label}.rarity`).toContain(weapon.rarity);

	expect(weapon.scales, `${label}.scales`).toEqual(expect.any(Object));
	const scales = /** @type {Record<string, unknown>} */ (weapon.scales);
	expect(Object.keys(scales).sort()).toEqual([...SCALE_KEYS].sort());
	for (const scale of SCALE_KEYS) {
		expect(scales[scale], `${label}.scales.${scale}`).toEqual(expect.any(Number));
		expect(scales[scale]).toBeGreaterThanOrEqual(0);
	}

	expect(weapon.damage, `${label}.damage`).toEqual(expect.any(Object));
	const damage = /** @type {{ min: unknown; max: unknown }} */ (weapon.damage);
	expect(damage.min, `${label}.damage.min`).toEqual(expect.any(Number));
	expect(damage.max, `${label}.damage.max`).toEqual(expect.any(Number));
	expect(damage.min).toBeGreaterThanOrEqual(0);
	expect(damage.max).toBeGreaterThanOrEqual(/** @type {number} */ (damage.min));
}

/**
 * @param {InstanceType<typeof import('$lib/items/weapons/factory.js').default>} weapon
 * @param {import('$lib/items/weapons/types.js').WeaponDefinition} definition
 * @param {string} [label]
 */
export function expectWeaponFactoryMatchesDefinition(weapon, definition, label = 'weapon') {
	expect(weapon.id, `${label}.id`).toBe(definition.id);
	expect(weapon.name, `${label}.name`).toBe(definition.name);
	expect(weapon.description, `${label}.description`).toBe(definition.description);
	expect(weapon.category, `${label}.category`).toBe(definition.category);
	expect(weapon.rarity, `${label}.rarity`).toBe(definition.rarity);
	expect(weapon.scales, `${label}.scales`).toBe(definition.scales);
	expect(weapon.damage, `${label}.damage`).toEqual(definition.damage);
}
