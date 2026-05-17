/** @typedef {import('$lib/characters/controller.js').default} BaseCharacter */
/** @typedef {import('$lib/monsters/controller.js').default} BaseMonster */
/** @typedef {import('$lib/environments/factory.js').default} Environment */

/** @typedef {BaseCharacter | BaseMonster} BattleCombatant */

/**
 * @typedef {'player' | 'opponent'} BattleSide
 */

/**
 * @typedef {'player' | 'opponent' | null} BattleWinner
 */

/**
 * @typedef {'player' | 'opponent'} BattleTurn
 */

/**
 * @typedef {'active' | 'victory' | 'defeat'} BattlePhase
 */

/**
 * @typedef {Object} BattleSetup
 * @property {BaseCharacter} player
 * @property {BattleCombatant} opponent
 * @property {Environment} environment
 */

/**
 * @typedef {Object} BattleActionResult
 * @property {BattleSide} attacker
 * @property {BattleSide} defender
 * @property {string} [skillId]
 * @property {number} damage
 * @property {boolean} isCritical
 * @property {boolean} defenderDefeated
 * @property {BattlePhase} phase
 * @property {BattleWinner} winner
 */

/**
 * @typedef {Object} CombatantSnapshot
 * @property {string} id
 * @property {string} name
 * @property {string} label
 * @property {BattleSide} side
 * @property {'character' | 'monster'} kind
 * @property {number} level
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} sp
 * @property {number} maxSp
 * @property {string[]} skills
 * @property {boolean} isAlive
 * @property {string | null} spriteKey
 * @property {string | null} promptPath
 */

export {};
