// ** Item factory */

import WEAPONS from '$lib/content/items/weapons';

/** @typedef {import('./types.js').WeaponId} WeaponId */
/** @typedef {import('./types.js').WeaponDefinition} WeaponDefinition */

export default class WeaponFactory {
	/** @type {WeaponDefinition} */
	_weaponDefinition;

	/**
	 * @param {WeaponId | undefined} [id]
	 */
	constructor(id) {
		if (!id) {
			throw new Error('Weapon ID is required');
		}

		if (!(id in WEAPONS)) {
			throw new Error('Invalid weapon ID');
		}

		this._weaponDefinition = WEAPONS[id];
	}

	/** @returns {WeaponId} */
	get id() {
		return this._weaponDefinition.id;
	}

	get name() {
		return this._weaponDefinition.name;
	}

	get description() {
		return this._weaponDefinition.description;
	}

	get category() {
		return this._weaponDefinition.category;
	}

	get rarity() {
		return this._weaponDefinition.rarity;
	}

	get scales() {
		return this._weaponDefinition.scales;
	}

	get damage() {
		return this._weaponDefinition.damage;
	}
}
