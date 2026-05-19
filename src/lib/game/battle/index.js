/** Battle module */

export { default as Battle } from './controller.svelte.js';
export {
	buildCharacterSpriteKey,
	isCharacter,
	isMonster,
	resolveCombatantDamage,
	snapshotCombatant
} from './combatant.js';
export { resolveClassSpriteUrl } from '$lib/game/presentation/sprites/classSprite.js';
export { resolveMonsterSpriteUrl } from '$lib/game/presentation/sprites/monsterSprite.js';
