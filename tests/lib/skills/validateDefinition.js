import { expect } from 'vitest';

import { SCALES, TIERS } from '$lib/enums';
import { SKILL_AFFINITY, SKILL_TARGET, SKILL_TYPES } from '$lib/skills/enums';

const SKILL_ID_PATTERN = /^\d{4}_[a-z0-9_]+$/;
const TIER_VALUES = Object.values(TIERS);
const SKILL_TYPE_VALUES = Object.values(SKILL_TYPES);
const SKILL_TARGET_VALUES = Object.values(SKILL_TARGET);
const AFFINITY_KEYS = Object.values(SKILL_AFFINITY);
const SCALE_KEYS = Object.values(SCALES);
const COST_KEYS = [SCALES.HP, SCALES.MP];

/** @param {import('$lib/skills/types.js').SkillDefinition} definition */
export function resolveSkillCost(definition) {
	return definition.cost ?? { [SCALES.HP]: 0, [SCALES.MP]: 0 };
}

/** @param {import('$lib/skills/types.js').SkillDefinition} definition */
export function resolveSkillDelay(definition) {
	return definition.delay ?? 0;
}

/** @param {import('$lib/skills/types.js').SkillDefinition} definition */
export function resolveSkillCooldown(definition) {
	return definition.cooldown ?? 0;
}

/** @param {import('$lib/skills/types.js').SkillDefinition} definition */
export function resolveSkillAffinity(definition) {
	return definition.affinity ?? { [SKILL_AFFINITY.PHYSICAL]: 1 };
}

/** @param {import('$lib/skills/types.js').SkillDefinition} definition */
export function resolveSkillRequirements(definition) {
	return definition.requirements;
}

/** @param {import('$lib/skills/types.js').SkillDefinition} definition */
export function resolveSkillStatRequirements(definition) {
	return definition.statRequirements;
}

/**
 * @param {unknown} cost
 * @param {string} label
 */
function expectSkillCostShape(cost, label) {
	expect(cost, `${label}.cost`).toEqual(expect.any(Object));
	const record = /** @type {Record<string, unknown>} */ (cost);
	expect(Object.keys(record).sort()).toEqual([...COST_KEYS].sort());
	for (const scale of COST_KEYS) {
		expect(record[scale], `${label}.cost.${scale}`).toEqual(expect.any(Number));
		expect(record[scale]).toBeGreaterThanOrEqual(0);
	}
}

/**
 * @param {unknown} affinity
 * @param {string} label
 */
function expectSkillAffinityShape(affinity, label) {
	expect(affinity, `${label}.affinity`).toEqual(expect.any(Object));
	const record = /** @type {Record<string, unknown>} */ (affinity);
	for (const [key, value] of Object.entries(record)) {
		expect(AFFINITY_KEYS, `${label}.affinity.${key}`).toContain(key);
		expect(value, `${label}.affinity.${key}`).toEqual(expect.any(Number));
		expect(value).toBeGreaterThanOrEqual(0);
	}
}

/**
 * @param {unknown} definition
 * @param {string} [label]
 */
export function expectSkillDefinition(definition, label = 'skill') {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const skill = /** @type {Record<string, unknown>} */ (definition);

	expect(skill.id, `${label}.id`).toEqual(expect.any(String));
	expect(skill.id).toMatch(SKILL_ID_PATTERN);

	expect(skill.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(skill.name).length).toBeGreaterThan(0);

	expect(skill.description, `${label}.description`).toEqual(expect.any(String));
	expect(String(skill.description).length).toBeGreaterThan(0);

	expect(skill.icon === null || typeof skill.icon === 'string', `${label}.icon`).toBe(true);

	expect(TIER_VALUES, `${label}.tier`).toContain(skill.tier);
	expect(SKILL_TYPE_VALUES, `${label}.type`).toContain(skill.type);
	expect(SKILL_TARGET_VALUES, `${label}.target`).toContain(skill.target);

	if (skill.cost !== undefined) {
		expectSkillCostShape(skill.cost, label);
	}

	if (skill.delay !== undefined) {
		expect(skill.delay, `${label}.delay`).toEqual(expect.any(Number));
		expect(skill.delay).toBeGreaterThanOrEqual(0);
	}

	if (skill.cooldown !== undefined) {
		expect(skill.cooldown, `${label}.cooldown`).toEqual(expect.any(Number));
		expect(skill.cooldown).toBeGreaterThanOrEqual(0);
	}

	if (skill.affinity !== undefined) {
		expectSkillAffinityShape(skill.affinity, label);
	}

	if (skill.requirements !== undefined) {
		expect(skill.requirements, `${label}.requirements`).toEqual(expect.any(Array));
		for (const requirement of /** @type {unknown[]} */ (skill.requirements)) {
			expect(requirement, `${label}.requirements[]`).toEqual(expect.any(String));
			expect(requirement).toMatch(SKILL_ID_PATTERN);
		}
	}

	if (skill.statRequirements !== undefined) {
		expect(skill.statRequirements, `${label}.statRequirements`).toEqual(expect.any(Object));
		const statRequirements = /** @type {Record<string, unknown>} */ (skill.statRequirements);
		for (const [key, value] of Object.entries(statRequirements)) {
			expect(SCALE_KEYS, `${label}.statRequirements.${key}`).toContain(key);
			expect(value, `${label}.statRequirements.${key}`).toEqual(expect.any(Number));
			expect(value).toBeGreaterThanOrEqual(0);
		}
	}

	expect(skill.scales, `${label}.scales`).toEqual(expect.any(Object));
	const scales = /** @type {Record<string, unknown>} */ (skill.scales);
	expect(Object.keys(scales).sort()).toEqual([...SCALE_KEYS].sort());
	for (const scale of SCALE_KEYS) {
		expect(scales[scale], `${label}.scales.${scale}`).toEqual(expect.any(Number));
	}
}

/**
 * @param {InstanceType<typeof import('$lib/skills/factory.js').default>} skill
 * @param {import('$lib/skills/types.js').SkillDefinition} definition
 * @param {string} [label]
 */
export function expectSkillFactoryMatchesDefinition(skill, definition, label = 'skill') {
	expect(skill.id, `${label}.id`).toBe(definition.id);
	expect(skill.name, `${label}.name`).toBe(definition.name);
	expect(skill.description, `${label}.description`).toBe(definition.description);
	expect(skill.icon, `${label}.icon`).toBe(definition.icon);
	expect(skill.tier, `${label}.tier`).toBe(definition.tier);
	expect(skill.type, `${label}.type`).toBe(definition.type);
	expect(skill.skillRequirements, `${label}.skillRequirements`).toBe(
		resolveSkillRequirements(definition)
	);
	expect(skill.statRequirements, `${label}.statRequirements`).toBe(
		resolveSkillStatRequirements(definition)
	);
	expect(skill.target, `${label}.target`).toBe(definition.target);
	expect(skill.affinity, `${label}.affinity`).toEqual(resolveSkillAffinity(definition));
	expect(skill.cost, `${label}.cost`).toEqual(resolveSkillCost(definition));
	expect(skill.delay, `${label}.delay`).toBe(resolveSkillDelay(definition));
	expect(skill.cooldown, `${label}.cooldown`).toBe(resolveSkillCooldown(definition));
	expect(skill.scales, `${label}.scales`).toBe(definition.scales);
}
