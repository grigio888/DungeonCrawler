//** Enums */

/**
 * Stat keys used for class scaling and attribute lookups.
 * @enum {string}
 */
export const SCALES = {
	/** Hit points. */
	HP: 'hp',
	/** Mana / magic points. */
	MP: 'mp',
	/** Physical damage and carry capacity. */
	STRENGTH: 'strength',
	/** Speed, evasion, and action order. */
	AGILITY: 'agility',
	/** Health pool and defensive resilience. */
	VITALITY: 'vitality',
	/** Spell power and mana efficiency. */
	INTELLIGENCE: 'intelligence',
	/** Accuracy, crit chance, and fine motor skills. */
	DEXTERITY: 'dexterity',
	/** Drop rates, crit damage variance, and proc odds. */
	LUCK: 'luck'
};

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

/**
 * Progression tier of a class.
 * @enum {string}
 */
export const TIERS = {
	/** Can be learned on its own, without prerequisites. */
	BASIC: 'basic',
	/** Requires a basic skill to be learned first. */
	ADVANCED: 'advanced',
	/** Requires an advanced skill to be learned first. */
	ULTIMATE: 'ultimate'
};

/**
 * Level progression type.
 * @enum {number}
 *
 * This is used to determine how many stats is gained per level.
 * Used for both monsters and players.
 */
export const LEVEL_PROGRESSION = {
	4: 3,
	9: 4,
	14: 5,
	19: 6,
	24: 7,
	29: 8,
	34: 9,
	39: 10,
	44: 11,
	49: 12,
	54: 13,
	59: 14,
	64: 15,
	69: 16,
	74: 17,
	79: 18,
	84: 19,
	89: 20,
	94: 21,
	99: 22
};
