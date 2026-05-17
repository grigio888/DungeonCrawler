import { CLASS_IDS, getClassDefaults } from '$lib/classes/index.js';

/** @typedef {'male' | 'female'} Gender */
/** @typedef {'player' | 'npc' | 'enemy'} CharacterKind */

/**
 * @param {Partial<CharacterSpec>} overrides
 * @returns {CharacterSpec}
 */
export function createCharacterSpec(overrides = {}) {
	const classId = overrides.classId ?? CLASS_IDS.SWORDSMAN;
	const subclassId = overrides.subclassId ?? null;
	const defaults = getClassDefaults(classId, subclassId);

	const maxHp = overrides.maxHp ?? defaults.maxHp;
	const maxSp = overrides.maxSp ?? defaults.maxSp;
	const stats = /** @type {CharacterSpec['stats']} */ ({
		...defaults.stats,
		...overrides.stats
	});

	return {
		id: overrides.id ?? createId(),
		kind: overrides.kind ?? 'player',
		name: overrides.name ?? 'Adventurer',
		gender: overrides.gender ?? 'female',
		classId,
		subclassId,
		level: overrides.level ?? 1,
		jobLevel: overrides.jobLevel ?? 1,
		exp: overrides.exp ?? 0,
		jobExp: overrides.jobExp ?? 0,
		hp: overrides.hp ?? maxHp,
		maxHp,
		sp: overrides.sp ?? maxSp,
		maxSp,
		stats,
		statPoints: overrides.statPoints ?? 0,
		skillPoints: overrides.skillPoints ?? 0,
		zeny: overrides.zeny ?? 0,
		spriteKey: overrides.spriteKey ?? null,
		statusEffects: overrides.statusEffects ?? [],
		equipment: overrides.equipment ?? createEmptyEquipment(),
		position: overrides.position ?? null,
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
 * @property {string | null} subclassId
 * @property {number} level
 * @property {number} jobLevel
 * @property {number} exp
 * @property {number} jobExp
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} sp
 * @property {number} maxSp
 * @property {{ str: number, agi: number, vit: number, int: number, dex: number, luk: number }} stats
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
		'subclassId',
		'level',
		'jobLevel',
		'exp',
		'jobExp',
		'hp',
		'maxHp',
		'sp',
		'maxSp',
		'stats',
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
