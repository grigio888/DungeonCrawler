import { getClassDefinition } from '$lib/content/classes/index.js';
import { computeVitals } from '$lib/game/progression/index.js';
import {
	createBaseCharacterScales,
	resolveCharacterScales
} from '$lib/game/progression/characterScales.js';

import { DEFAULT_FACING } from '$lib/core/constants/sprites.js';
import { GENDER } from '$lib/core/enum/characters.js';
import { isValidGender, resolveGender } from '$lib/core/helpers/characters.js';

/** @typedef {import('$lib/core/enum/characters.js').Gender} Gender */

export { isValidGender, resolveGender };
/** @typedef {'player' | 'npc' | 'enemy'} CharacterKind */
/** @typedef {[string, number]} ClassHistoryEntry */
/** @typedef {ClassHistoryEntry[]} ClassHistory */

/**
 * @typedef {Object} BaseCharacterInput
 * @property {Gender} [gender]
 * @property {string} [name]
 * @property {CharacterKind} [kind]
 * @property {number} [level]
 * @property {Record<string, number>} [scales]
 */

/**
 * @typedef {Object} BaseCharacter
 * @property {string} name
 * @property {Gender} gender
 * @property {CharacterKind} kind
 * @property {number} level
 * @property {Record<string, number>} scales
 */

/**
 * Base identity + stat floor (5 in each allocatable stat). Class is applied later via `createCharacterSpec`.
 * @param {BaseCharacterInput} [overrides]
 * @returns {BaseCharacter}
 */
export function createBaseCharacter(overrides = {}) {
	return {
		name: overrides.name ?? 'Adventurer',
		gender: resolveGender(overrides.gender),
		kind: overrides.kind ?? 'player',
		level: overrides.level ?? 1,
		scales: overrides.scales ?? createBaseCharacterScales()
	};
}

/**
 * @param {string} classId
 * @param {number} level
 * @param {string | null} [subclassId]
 * @param {Object} [options]
 * @param {Record<string, number>} [options.existingScales]
 * @param {number} [options.previousLevel]
 */
export function buildCharacterStats(classId, level, subclassId = null, options = {}) {
	void subclassId;
	const classDef = getClassDefinition(classId);
	const scales = resolveCharacterScales({
		level,
		statWeights: classDef.statWeights,
		existingScales: options.existingScales,
		previousLevel: options.previousLevel
	});
	const { maxHp, maxSp } = computeVitals(scales, classDef.baseVitals ?? {}, {
		level,
		vitalProgression: classDef.vitalProgression ?? null
	});

	return { scales, maxHp, maxSp };
}

/**
 * @param {Partial<CharacterSpec> & Record<string, unknown>} [overrides]
 * @returns {CharacterSpec & Record<string, unknown>}
 */
export function createCharacterSpec(overrides = {}) {
	const base = createBaseCharacter({
		gender: overrides.gender,
		name: overrides.name,
		kind: overrides.kind,
		level: overrides.level,
		scales:
			overrides.scales != null
				? /** @type {Record<string, number>} */ (overrides.scales)
				: undefined
	});

	const classId = overrides.classId ?? 'peasant';
	const subclassId = overrides.subclassId ?? null;
	const classDef = getClassDefinition(classId);
	const level = overrides.level ?? classDef.level ?? base.level;
	const previousLevel =
		typeof overrides.previousLevel === 'number' ? overrides.previousLevel : undefined;

	let existingScales;
	if (previousLevel != null) {
		existingScales = base.scales;
	} else if (overrides.scales != null) {
		existingScales = /** @type {Record<string, number>} */ (overrides.scales);
	} else {
		existingScales = undefined;
	}

	const scales = resolveCharacterScales({
		level,
		statWeights: classDef.statWeights,
		existingScales,
		previousLevel
	});

	const { maxHp, maxSp } = computeVitals(scales, classDef.baseVitals ?? {}, {
		level,
		vitalProgression: classDef.vitalProgression ?? null
	});

	const classHistory =
		overrides.classHistory != null
			? /** @type {ClassHistory} */ (overrides.classHistory)
			: [[classId, level]];

	return {
		id: overrides.id ?? createId(),
		kind: base.kind,
		name: base.name,
		gender: base.gender,
		classId,
		classHistory,
		subclassId,
		level,
		jobLevel: overrides.jobLevel ?? 1,
		exp: overrides.exp ?? 0,
		jobExp: overrides.jobExp ?? 0,
		hp: overrides.hp ?? maxHp,
		maxHp: overrides.maxHp ?? maxHp,
		sp: overrides.sp ?? maxSp,
		maxSp: overrides.maxSp ?? maxSp,
		scales,
		statWeights: classDef.statWeights,
		baseDamage: classDef.baseDamage ?? { min: 1, max: 1 },
		baseVitals: classDef.baseVitals ?? {},
		vitalProgression: classDef.vitalProgression ?? null,
		statPoints: overrides.statPoints ?? 0,
		skillPoints: overrides.skillPoints ?? 0,
		zeny: overrides.zeny ?? 0,
		spriteKey: overrides.spriteKey ?? null,
		statusEffects: overrides.statusEffects ?? [],
		equipment: overrides.equipment ?? createEmptyEquipment(),
		position: overrides.position ?? { facing: DEFAULT_FACING },
		skills: overrides.skills ?? classDef.skills ?? [],
		...pickMeta(overrides)
	};
}

/**
 * @typedef {Object} CharacterSpec
 * @property {string} id
 * @property {CharacterKind} kind
 * @property {string} name
 * @property {Gender} gender
 * @property {string} classId
 * @property {ClassHistory} classHistory
 * @property {string | null} subclassId
 * @property {number} level
 * @property {number} jobLevel
 * @property {number} exp
 * @property {number} jobExp
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} sp
 * @property {number} maxSp
 * @property {Record<string, number>} scales
 * @property {Record<string, number>} statWeights
 * @property {{ min: number, max: number }} baseDamage
 * @property {{ hp?: number, mp?: number }} baseVitals
 * @property {{ hpPerLevel?: number, spPerLevel?: number } | null} vitalProgression
 * @property {string[]} skills
 * @property {number} statPoints
 * @property {number} skillPoints
 * @property {number} zeny
 * @property {string | null} spriteKey
 * @property {unknown[]} statusEffects
 * @property {EquipmentSlots} equipment
 * @property {{ x: number, y: number, facing?: string } | null} position
 */

/** @typedef {Record<string, string | null>} EquipmentSlots */
export function createEmptyEquipment() {
	return {
		headTop: null,
		headMid: null,
		headLow: null,
		armor: null,
		weapon: null,
		shield: null,
		garment: null,
		shoes: null,
		accessoryLeft: null,
		accessoryRight: null
	};
}

function createId() {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `char_${Date.now()}`;
}

/** @param {Record<string, unknown>} overrides */
function pickMeta(overrides) {
	const known = new Set([
		'id',
		'kind',
		'name',
		'gender',
		'classId',
		'classHistory',
		'subclassId',
		'level',
		'previousLevel',
		'previousClassId',
		'jobLevel',
		'exp',
		'jobExp',
		'hp',
		'maxHp',
		'sp',
		'maxSp',
		'scales',
		'statWeights',
		'baseDamage',
		'baseVitals',
		'vitalProgression',
		'skills',
		'statPoints',
		'skillPoints',
		'zeny',
		'spriteKey',
		'statusEffects',
		'equipment',
		'position'
	]);
	/** @type {Record<string, unknown>} */
	const extra = {};
	for (const [key, value] of Object.entries(overrides)) {
		if (!known.has(key)) extra[key] = value;
	}
	return extra;
}
