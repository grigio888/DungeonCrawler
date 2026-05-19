// ** Skill factory */

// False positive for TIERS
// eslint-disable-next-line no-unused-vars
import { SCALES } from '$lib/core/enum/stats.js';
import { SKILL_AFFINITY, SKILL_TARGET, SKILL_TYPES, TIERS } from '$lib/core/enum/skills.js';
import SKILLS from './index.js';

/** @typedef {import('./types.js').SkillId} SkillId */
/** @typedef {import('./types.js').SkillDefinition} SkillDefinition */

export default class SkillFactory {
	/** @type {SkillDefinition} */
	_skillDefinition;

	/**
	 * @param {SkillId | undefined} [id]
	 */
	constructor(id) {
		if (!id) {
			throw new Error('Skill ID is required');
		}

		if (!(id in SKILLS)) {
			throw new Error('Invalid skill ID');
		}

		this._skillDefinition = SKILLS[id];
	}

	/**
	 * @returns {SkillId}
	 * The ID of the skill (internal usage only).
	 */
	get id() {
		return this._skillDefinition.id;
	}

	/**
	 * @returns {string}
	 * The name of the skill.
	 */
	get name() {
		return this._skillDefinition.name;
	}

	/**
	 * @returns {string}
	 * The description of the skill.
	 */
	get description() {
		return this._skillDefinition.description;
	}

	/**
	 * @returns {string | null}
	 * The icon of the skill.
	 */
	get icon() {
		return this._skillDefinition.icon;
	}

	/**
	 * @returns {TIERS}
	 * The progression tier of the skill in a skill tree.
	 */
	get tier() {
		return this._skillDefinition.tier;
	}

	/**
	 * @returns {SKILL_TYPES}
	 * The type of the skill.
	 */
	get type() {
		return this._skillDefinition.type;
	}

	/**
	 * @returns {SkillDefinition['skillRequirements']}
	 * The skill requirements of the skill.
	 *
	 * @example
	 * [ new Skill('0001_skill') ]
	 *
	 * This means the skill requires the player to have the skill '0001_attack'.
	 *
	 * @example
	 * [ new Skill('0001_skill'), new Skill('0002_skill') ]
	 *
	 * This means the skill requires the player to have the skills '0001_attack' and '0002_attack'.
	 */
	get skillRequirements() {
		return this._skillDefinition.requirements;
	}

	/**
	 * @returns {SkillDefinition['statRequirements']}
	 * The stat requirements of the skill.
	 *
	 * @example
	 * {
	 *     [SCALES.STRENGTH]: 10
	 * }
	 *
	 * This means the skill requires the player to have 100 HP and 10 MP.
	 */
	get statRequirements() {
		return this._skillDefinition.statRequirements;
	}

	/**
	 * @returns {SKILL_TARGET}
	 * The target type of the skill.
	 */
	get target() {
		return this._skillDefinition.target;
	}

	/**
	 * @returns {SKILL_AFFINITY}
	 * The affinity of the skill.
	 */
	get affinity() {
		return this._skillDefinition.affinity || { [SKILL_AFFINITY.PHYSICAL]: 1 };
	}

	/**
	 * @returns {SCALES}
	 * The cost of the skill.
	 */
	get cost() {
		return this._skillDefinition.cost || { [SCALES.HP]: 0, [SCALES.MP]: 0 };
	}

	/**
	 * @returns {number}
	 * The delay of the skill.
	 */
	get delay() {
		return this._skillDefinition.delay ?? 0;
	}

	/**
	 * @returns {number}
	 * The cooldown of the skill.
	 */
	get cooldown() {
		return this._skillDefinition.cooldown || 0;
	}

	/**
	 * @returns {SCALES}
	 * The scales of the skill.
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
	 * This means the skill has no effect when used.
	 * Any scale value greater than 0 will be applied when used.
	 */
	get scales() {
		return this._skillDefinition.scales;
	}
}
