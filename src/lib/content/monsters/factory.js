import { buildStatsForLevel } from '$lib/game/progression/buildStats.js';
import MONSTERS from './registry.js';

/** @typedef {import('$lib/core/enum/monsters.js').MonsterKind} MonsterKind */

/** @typedef {import('./registry.js').default[string]} MonsterDefinition */

/**
 * @param {string} monsterId
 * @returns {MonsterDefinition}
 */
export function getMonsterDefaults(monsterId) {
	return MONSTERS[monsterId] ?? MONSTERS['0001_jelly'];
}

/**
 * @param {MonsterDefinition} definition
 * @param {number} level
 */
export function buildMonsterStats(definition, level) {
	return buildStatsForLevel(level, definition.statWeights, definition.baseVitals ?? {});
}

/**
 * @param {Partial<MonsterSpec> & Record<string, unknown>} [overrides]
 * @returns {MonsterSpec & Record<string, unknown>}
 */
export function createMonsterSpec(overrides = {}) {
	const monsterId = overrides.monsterId ?? '0001_jelly';
	const defaults = getMonsterDefaults(monsterId);
	const level = overrides.level ?? defaults.level ?? 1;
	const built = buildMonsterStats(defaults, level);

	const scales = {
		...built.scales,
		...overrides.scales
	};
	const maxHp = overrides.maxHp ?? built.maxHp;
	const maxSp = overrides.maxSp ?? built.maxSp;

	return {
		id: overrides.id ?? createId(),
		monsterId,
		kind: overrides.kind ?? defaults.kind,
		name: overrides.name ?? defaults.name,
		description: overrides.description ?? defaults.description,
		level,
		hp: overrides.hp ?? maxHp,
		maxHp,
		sp: overrides.sp ?? maxSp,
		maxSp,
		scales,
		skills: overrides.skills ?? defaults.skills ?? [],
		statWeights: defaults.statWeights,
		baseVitals: defaults.baseVitals ?? {},
		baseDamage: defaults.baseDamage ?? { min: 1, max: 1 },
		statusEffects: overrides.statusEffects ?? [],
		spriteKey: overrides.spriteKey ?? null,
		position: overrides.position ?? null,
		...pickMeta(overrides)
	};
}

/**
 * @typedef {Object} MonsterSpec
 * @property {string} id
 * @property {string} monsterId
 * @property {MonsterKind} kind
 * @property {string} name
 * @property {string} description
 * @property {number} level
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} sp
 * @property {number} maxSp
 * @property {Record<string, number>} scales
 * @property {Record<string, number>} statWeights
 * @property {{ hp?: number, mp?: number }} baseVitals
 * @property {{ min: number, max: number }} baseDamage
 * @property {string[]} skills
 * @property {unknown[]} statusEffects
 * @property {string | null} spriteKey
 * @property {{ x: number, y: number, facing?: string } | null} position
 */

function createId() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `monster_${Date.now()}`;
}

/** @param {Record<string, unknown>} overrides */
function pickMeta(overrides) {
	const known = new Set([
		'id',
		'monsterId',
		'kind',
		'name',
		'description',
		'level',
		'hp',
		'maxHp',
		'sp',
		'maxSp',
		'scales',
		'statWeights',
		'baseVitals',
		'baseDamage',
		'skills',
		'statusEffects',
		'spriteKey',
		'position'
	]);
	/** @type {Record<string, unknown>} */
	const extra = {};
	for (const [key, value] of Object.entries(overrides)) {
		if (!known.has(key)) extra[key] = value;
	}
	return extra;
}
