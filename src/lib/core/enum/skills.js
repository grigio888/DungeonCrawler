/**
 * Progression tier of a skill.
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
 * Who a skill can target.
 * @enum {string}
 */
export const SKILL_TARGET = {
	/** Skill targets the caster. */
	SELF: 'self',
	/** Skill targets an enemy. */
	ENEMY: 'enemy',
	/** Skill targets the environment. */
	ENVIRONMENT: 'environment'
};

/**
 * Primary role of a skill in combat.
 * @enum {string}
 */
export const SKILL_TYPES = {
	/** Skill deals damage to the enemy. */
	OFFENSIVE: 'offensive',
	/** Skill prevents or reduces damage to the caster. */
	DEFENSIVE: 'defensive',
	/** Skill applies beneficial effects to allies. */
	SUPPORTIVE: 'supportive',
	/** Skill with miscellaneous effects. */
	UTILITY: 'utility'
};

/**
 * Affinity of the skill.
 * @enum {string}
 */
export const SKILL_AFFINITY = {
	/** Skill has a physical affinity with the caster. */
	PHYSICAL: 'physical',
	/** Skill has a magical affinity with the caster. */
	MAGICAL: 'magical'
};

/**
 * Effect family applied by a skill.
 * @enum {string}
 */
export const SKILL_EFFECTS = {
	/** Self-targeted effects. */
	SELF: 'self',
	/** Environment-targeted effects. */
	OPPONENT: 'opponent',
	/** Deals damage to a target. */
	DAMAGE: 'damage',
	/** Restores HP to a target. */
	HP_HEAL: 'hp_heal',
	/** Adds Regeneration to HP to a target. */
	HP_REGENERATION: 'hp_regeneration',
	/** Restores MP to a target. */
	MP_HEAL: 'mp_heal',
	/** Adds Regeneration to MP to a target. */
	MP_REGENERATION: 'mp_regeneration',
	/** Applies a positive status to a target. */
	BUFF: 'buff',
	/** Applies a negative status to a target. */
	DEBUFF: 'debuff'
};
