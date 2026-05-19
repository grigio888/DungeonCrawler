import { buildCharacterSpriteKey as buildSpriteKey } from '$lib/game/presentation/sprites/characterSprite.js';

/** @typedef {import('./types.js').BattleCombatant} BattleCombatant */
/** @typedef {import('./types.js').BattleSide} BattleSide */
/** @typedef {import('./types.js').CombatantSnapshot} CombatantSnapshot */

/**
 * @param {BattleCombatant} entity
 * @returns {entity is import('$lib/game/entities/character/controller.js').default}
 */
export function isCharacter(entity) {
	return 'classId' in entity.spec;
}

/**
 * @param {BattleCombatant} entity
 * @returns {entity is import('$lib/game/entities/monster/controller.js').default}
 */
export function isMonster(entity) {
	return 'monsterId' in entity.spec;
}

/**
 * @param {BattleCombatant} entity
 * @param {BattleSide} side
 * @returns {CombatantSnapshot}
 */
export function snapshotCombatant(entity, side) {
	return {
		id: entity.id,
		name: entity.name,
		label: entity.displayLabel,
		side,
		kind: isCharacter(entity) ? 'character' : 'monster',
		level: entity.level,
		hp: entity.hp,
		maxHp: entity.maxHp,
		sp: entity.sp,
		maxSp: entity.maxSp,
		skills: [...entity.skills],
		isAlive: entity.isAlive,
		spriteKey: isCharacter(entity) ? buildCharacterSpriteKey(entity) : null,
		promptPath: entity.promptPath
	};
}

/**
 * @param {import('$lib/game/entities/character/controller.js').default} character
 */
export function buildCharacterSpriteKey(character) {
	const animation = character.isAlive ? 'idle' : 'dead';
	return buildSpriteKey(character.gender, character.spec.position?.facing, animation);
}

/**
 * @param {BattleCombatant} attacker
 * @param {string} [skillId]
 */
/**
 * @param {BattleCombatant} attacker
 * @param {string} [skillId]
 * @returns {import('$lib/game/combat/damage.js').DamageEstimate}
 */
export function resolveCombatantDamage(attacker, skillId = '0001_attack') {
	if (typeof attacker.estimateDamage === 'function') {
		return attacker.estimateDamage(skillId, {
			randomizeWeaponDamage: true,
			randomizeBaseDamage: true
		});
	}

	return { damage: Math.max(1, attacker.level), isCritical: false };
}
