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
