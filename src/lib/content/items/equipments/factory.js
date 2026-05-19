// ** Equipment factory */

import EQUIPMENTS from '$lib/content/items/equipments';

/** @typedef {import('./types.js').EquipmentId} EquipmentId */
/** @typedef {import('./types.js').EquipmentDefinition} EquipmentDefinition */

export default class EquipmentFactory {
	/** @type {EquipmentDefinition} */
	_equipmentDefinition;

	/**
	 * @param {EquipmentId | undefined} [id]
	 */
	constructor(id) {
		if (!id) {
			throw new Error('Equipment ID is required');
		}

		if (!(id in EQUIPMENTS)) {
			throw new Error('Invalid equipment ID');
		}

		this._equipmentDefinition = EQUIPMENTS[id];
	}

	/**
	 * @returns {EquipmentId}
	 * The ID of the equipment (internal usage only).
	 */
	get id() {
		return this._equipmentDefinition.id;
	}

	/**
	 * @returns {string}
	 * The name of the equipment.
	 */
	get name() {
		return this._equipmentDefinition.name;
	}

	/**
	 * @returns {string}
	 * The description of the equipment.
	 */
	get description() {
		return this._equipmentDefinition.description;
	}

	/**
	 * @returns {EquipmentDefinition['category']}
	 * The category of the equipment.
	 */
	get category() {
		return this._equipmentDefinition.category;
	}

	/**
	 * @returns {EquipmentDefinition['slot']}
	 * The slot where the equipment is to be equipped.
	 */
	get slot() {
		return this._equipmentDefinition.slot;
	}

	/**
	 * @returns {EquipmentDefinition['rarity']}
	 * The rarity of the equipment.
	 */
	get rarity() {
		return this._equipmentDefinition.rarity;
	}

	/**
	 * @returns {EquipmentDefinition['scales']}
	 * The scales of the equipment.
	 *
	 * @example
	 * {
	 *     [SCALES.HP]: 0,
	 *     [SCALES.MP]: 0,
	 *     [SCALES.STRENGTH]: 0,
	 *     [SCALES.AGILITY]: 0,
	 *     [SCALES.VITALITY]: 0,
	 *     [SCALES.INTELLIGENCE]: 0,
	 *     [SCALES.DEXTERITY]: 0,
	 *     [SCALES.LUCK]: 0
	 * }
	 *
	 * This means the equipment has no effect on the player's stats.
	 * Any scale value greater than 0 will be applied as accumulated bonus.
	 */
	get scales() {
		return this._equipmentDefinition.scales;
	}

	/**
	 * @returns {EquipmentDefinition['defense']}
	 * The defense of the equipment.
	 */
	get defense() {
		return this._equipmentDefinition.defense;
	}
}
