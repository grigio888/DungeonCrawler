import { SCALES } from '$lib/enums.js';

/** Stats eligible to be the dominant damage scale (highest class statWeight wins). */
export const DAMAGE_DOMINANT_SCALES = [
	SCALES.STRENGTH,
	SCALES.INTELLIGENCE,
	SCALES.DEXTERITY,
	SCALES.LUCK
];

/** Base critical hit chance before luck (10%). */
export const BASE_CRITICAL_CHANCE = 0.1;

/** Additional critical chance per luck point (1%). */
export const LUCK_CRITICAL_CHANCE_PER_POINT = 0.01;

/** +1% max-roll chance per dexterity point (before cap). */
export const DEX_MAX_ROLL_CHANCE_PER_POINT = 0.01;

/** Upper bound on rolling max damage from dexterity alone. */
export const DEX_MAX_ROLL_CHANCE_CAP = 0.85;

/**
 * @typedef {Object} WeaponDamageProfile
 * @property {Record<string, number>} [scales]
 * @property {{ min: number, max: number }} [damage]
 */

/**
 * @typedef {Object} DamageEstimate
 * @property {number} damage
 * @property {boolean} isCritical
 */

/**
 * Critical hit chance from luck (10% base + 1% per luck point, capped at 100%).
 * @param {number} [luck]
 */
export function getCriticalChance(luck = 0) {
	const value = Math.max(0, luck);
	return Math.min(1, BASE_CRITICAL_CHANCE + value * LUCK_CRITICAL_CHANCE_PER_POINT);
}

/**
 * @param {number} [luck]
 */
export function rollIsCritical(luck = 0) {
	return Math.random() < getCriticalChance(luck);
}

/**
 * Chance (0–1) that a randomized damage roll resolves to the range maximum.
 * @param {number} [dexterity]
 */
export function getMaxDamageChance(dexterity = 0) {
	const dex = Math.max(0, dexterity);
	return Math.min(DEX_MAX_ROLL_CHANCE_CAP, dex * DEX_MAX_ROLL_CHANCE_PER_POINT);
}

/**
 * Class stat weight with the highest value (first wins on ties).
 * @param {Record<string, number>} [classStatWeights]
 * @returns {string | null}
 */
export function getDominantDamageScale(classStatWeights = {}) {
	let dominantScale = null;
	let dominantWeight = -1;

	for (const scale of DAMAGE_DOMINANT_SCALES) {
		const weight = classStatWeights[scale] ?? 0;
		if (weight > dominantWeight) {
			dominantWeight = weight;
			dominantScale = scale;
		}
	}

	return dominantScale;
}

/**
 * @param {{ min: number, max: number }} [range]
 */
export function maxDamageRange(range) {
	if (!range) return 0;
	return Math.max(range.min, range.max);
}

/**
 * @param {{ min: number, max: number }} [range]
 * @param {number} [dexterity] Higher dexterity increases the chance to roll max.
 */
export function rollDamageRange(range, dexterity = 0) {
	if (!range) return 0;
	const min = Math.min(range.min, range.max);
	const max = Math.max(range.min, range.max);
	if (min === max) return min;

	if (Math.random() < getMaxDamageChance(dexterity)) {
		return max;
	}

	return Math.floor(min + Math.random() * (max - min + 1));
}

/** @deprecated Use rollDamageRange */
export const rollWeaponBaseDamage = rollDamageRange;

/**
 * @param {{ min: number, max: number }} [range]
 */
export function averageDamageRange(range) {
	if (!range) return 0;
	return Math.floor((range.min + range.max) / 2);
}

/**
 * @param {Record<string, number>} statScales
 * @param {string | null} dominantScale
 * @returns {boolean}
 */
function scaleApplies(statScales, dominantScale) {
	if (!dominantScale) return false;
	const weight = statScales[dominantScale];
	return weight != null && weight !== 0;
}

/**
 * @param {{ min: number, max: number } | null | undefined} range
 * @param {boolean} randomize
 * @param {number} [dexterity]
 * @param {boolean} [isCritical]
 */
function resolveDamageFromRange(range, randomize, dexterity = 0, isCritical = false) {
	if (!range) return 0;
	if (!randomize) return averageDamageRange(range);
	if (isCritical) return maxDamageRange(range);
	return rollDamageRange(range, dexterity);
}

/**
 * @param {Object} params
 * @param {Record<string, number>} params.stats
 * @param {Record<string, number>} params.classStatWeights
 * @param {Record<string, number>} [params.skillScales]
 * @param {WeaponDamageProfile | null} [params.weapon]
 * @param {{ min: number, max: number } | null} [params.baseDamage]
 * @param {boolean} [params.randomizeWeaponDamage]
 * @param {boolean} [params.randomizeBaseDamage]
 * @returns {DamageEstimate}
 */
export function estimateDamage({
	stats,
	classStatWeights,
	skillScales = {},
	weapon = null,
	baseDamage = null,
	randomizeWeaponDamage = false,
	randomizeBaseDamage = false
}) {
	const dominantScale = getDominantDamageScale(classStatWeights);
	const dexterity = stats[SCALES.DEXTERITY] ?? 0;
	const luck = stats[SCALES.LUCK] ?? 0;
	const isRolling = randomizeBaseDamage || randomizeWeaponDamage;
	const isCritical = isRolling && rollIsCritical(luck);

	let initialDamage = resolveDamageFromRange(
		baseDamage,
		randomizeBaseDamage,
		dexterity,
		isCritical
	);

	if (weapon?.damage) {
		initialDamage += resolveDamageFromRange(
			weapon.damage,
			randomizeWeaponDamage,
			dexterity,
			isCritical
		);
	}

	initialDamage *= 1 + (stats[dominantScale] ?? 0) * 0.15;

	let multiplicator = 0;

	if (weapon?.scales && scaleApplies(weapon.scales, dominantScale)) {
		multiplicator += weapon.scales[dominantScale] ?? 0;
	}

	if (scaleApplies(skillScales, dominantScale)) {
		multiplicator += skillScales[dominantScale] ?? 0;
	}

	const statFactor = 1 + multiplicator * 0.5;

    let finalDamage = Math.max(1, Math.floor(initialDamage * statFactor));

    if (isRolling && isCritical) {
        finalDamage *= 2;
    }

    return {
        damage: finalDamage,
        isCritical: isRolling && isCritical
    };
}
