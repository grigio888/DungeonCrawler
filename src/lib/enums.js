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
