/** Equipment slot enums — align with character `EquipmentSlots` keys */

/**
 * Body slot an equipment piece occupies when equipped.
 * @enum {string}
 */
export const EQUIPMENT_SLOTS = {
	/** Upper headgear (hats, helms). */
	HEAD_TOP: 'headTop',
	/** Mid headgear (masks, glasses). */
	HEAD_MID: 'headMid',
	/** Lower headgear (beards, lower masks). */
	HEAD_LOW: 'headLow',
	/** Body armor (robes, plate). */
	ARMOR: 'armor',
	/** Off-hand shield or parrying item. */
	SHIELD: 'shield',
	/** Garment / cape slot. */
	GARMENT: 'garment',
	/** Footwear. */
	SHOES: 'shoes',
	/** Left accessory ring / trinket. */
	ACCESSORY_LEFT: 'accessoryLeft',
	/** Right accessory ring / trinket. */
	ACCESSORY_RIGHT: 'accessoryRight'
};
