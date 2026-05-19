import { computeVitals } from '$lib/game/progression/index.js';
import { buildCharacterScales } from '$lib/game/progression/characterScales.js';
import CLASSES from './registry.js';

/** @typedef {keyof typeof CLASSES} ClassId */

/** @typedef {(typeof CLASSES)[ClassId]} ClassDefinition */

/**
 * @param {string} classId
 * @returns {ClassDefinition}
 */
export function getClassDefinition(classId) {
	return CLASSES[/** @type {ClassId} */ (classId)] ?? CLASSES.peasant;
}

/**
 * @param {string} classId
 * @param {number} level
 * @param {string | null} [subclassId]
 */
export function buildClassStats(classId, level, subclassId = null) {
	void subclassId;
	const definition = getClassDefinition(classId);
	const scales = buildCharacterScales(level, definition.statWeights);
	const { maxHp, maxSp } = computeVitals(scales, definition.baseVitals ?? {}, {
		level,
		vitalProgression: definition.vitalProgression ?? null
	});

	return { scales, maxHp, maxSp };
}

/**
 * @param {string} classId
 * @param {string | null} [subclassId]
 */
export function resolvePromptPath(classId, subclassId = null) {
	const definition = getClassDefinition(classId);
	const base = definition.promptPath ?? classId;
	if (subclassId) return `${base}/${subclassId}`;
	return base;
}
