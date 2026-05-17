import { getClassDefinition } from '$lib/classes';
import {
	createCharacterSpec,
	createEmptyEquipment,
	resolveGender
} from '$lib/characters';
import { DEFAULT_FACING } from '$lib/sprites';

import {
	createInitialClassHistory,
	getCurrentClassId,
	normalizeClassHistory
} from '../classHistory.js';
import { getModels } from '../connector.js';

/**
 * @param {import('sequelize').Model} row
 */
function toPlain(row) {
	return row.get({ plain: true });
}

/**
 * @param {Record<string, unknown>} plain
 * @returns {import('$lib/characters/factory.js').CharacterSpec & Record<string, unknown>}
 */
export function specFromRow(plain) {
	const classHistory = normalizeClassHistory(plain.classes);
	const level = Number(plain.level);
	const classId = getCurrentClassId(classHistory);

	return createCharacterSpec({
		id: String(plain.id),
		kind: plain.kind,
		name: plain.name,
		gender: plain.gender,
		classId,
		level,
		classHistory,
		jobLevel: plain.jobLevel,
		exp: plain.exp,
		equipment: plain.equipment,
		skills: plain.skills,
		skillPoints: plain.skillPoints,
		zeny: plain.zeny,
		statusEffects: plain.statusEffects,
		position: plain.position
	});
}

/**
 * @param {import('$lib/characters/factory.js').CharacterSpec & { classHistory?: import('../classHistory.js').ClassHistory }} spec
 */
export function rowFromSpec(spec) {
	const classHistory =
		spec.classHistory ?? createInitialClassHistory(spec.classId, spec.level);

	return {
		id: spec.id,
		kind: spec.kind,
		name: spec.name,
		gender: spec.gender,
		level: spec.level,
		classes: classHistory,
		jobLevel: spec.jobLevel,
		exp: spec.exp,
		equipment: spec.equipment,
		skills: spec.skills,
		skillPoints: spec.skillPoints,
		zeny: spec.zeny,
		statusEffects: spec.statusEffects,
		position: spec.position
	};
}

/** @returns {Promise<import('./characterRepository.js').CharacterSummary[]>} */
export async function listCharacters() {
	const { Character } = getModels();
	const rows = await Character.findAll({ order: [['updated_at', 'DESC']] });

	return rows.map((row) => {
		const spec = specFromRow(toPlain(row));
		return {
			id: spec.id,
			name: spec.name,
			gender: spec.gender,
			classId: spec.classId,
			level: spec.level,
			jobLevel: spec.jobLevel,
			hp: spec.hp,
			maxHp: spec.maxHp,
			sp: spec.sp,
			maxSp: spec.maxSp,
			updatedAt:
				toPlain(row).updatedAt instanceof Date
					? toPlain(row).updatedAt.toISOString()
					: String(toPlain(row).updatedAt)
		};
	});
}

/**
 * @param {string} id
 * @returns {Promise<(import('$lib/characters/factory.js').CharacterSpec & Record<string, unknown>) | null>}
 */
export async function getCharacterById(id) {
	const { Character } = getModels();
	const row = await Character.findByPk(id);
	if (!row) return null;
	return specFromRow(toPlain(row));
}

/**
 * @param {import('$lib/characters/factory.js').BaseCharacterInput & { classId?: string, level?: number }} input
 */
export async function createCharacter(input) {
	const classId = input.classId ?? 'peasant';
	const level = input.level ?? 1;
	const classDef = getClassDefinition(classId);

	const { Character } = getModels();
	const row = await Character.create({
		kind: input.kind ?? 'player',
		name: input.name ?? 'Adventurer',
		gender: resolveGender(input.gender),
		level,
		classes: createInitialClassHistory(classId, level),
		jobLevel: 1,
		exp: 0,
		equipment: createEmptyEquipment(),
		skills: classDef.skills ?? [],
		skillPoints: 0,
		zeny: 0,
		statusEffects: [],
		position: { facing: DEFAULT_FACING }
	});

	return specFromRow(toPlain(row));
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteCharacter(id) {
	const { Character } = getModels();
	const deleted = await Character.destroy({ where: { id } });
	return deleted > 0;
}

/**
 * @typedef {Object} CharacterSummary
 * @property {string} id
 * @property {string} name
 * @property {string} gender
 * @property {string} classId
 * @property {number} level
 * @property {number} jobLevel
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} sp
 * @property {number} maxSp
 * @property {string} updatedAt
 */
