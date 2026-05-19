/**
 * Loot and content quality tier, lowest to highest.
 * @enum {string}
 */
export const RARITY = {
	/** Default tier; widely available. */
	COMMON: 'common',
	/** Slightly improved stats or effects. */
	UNCOMMON: 'uncommon',
	/** Notable power spike; less frequent drops. */
	RARE: 'rare',
	/** Strong bonuses; intentionally scarce. */
	EPIC: 'epic',
	/** Top tier; unique or very rare. */
	LEGENDARY: 'legendary'
};

/** @enum {string} */
export const ITEM_CATEGORIES = {
	WEAPON: 'weapon',
	ARMOR: 'armor',
	ACCESSORY: 'accessory',
	CONSUMABLE: 'consumable',
	MATERIAL: 'material',
	QUEST: 'quest'
};

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
