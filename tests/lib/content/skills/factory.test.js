import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/core/enum/stats.js';
import { SKILL_AFFINITY } from '$lib/core/enum/skills.js';
import SKILLS from '$lib/content/skills';
import SkillFactory from '$lib/content/skills/factory';

import {
	expectSkillFactoryMatchesDefinition,
	resolveSkillAffinity,
	resolveSkillCost,
	resolveSkillCooldown,
	resolveSkillDelay,
	resolveSkillRequirements,
	resolveSkillStatRequirements
} from './validateDefinition.js';

describe('skills/factory', () => {
	it('requires a skill id', () => {
		expect(() => new SkillFactory()).toThrow('Skill ID is required');
		expect(() => new SkillFactory('')).toThrow('Skill ID is required');
	});

	it('rejects unknown skill ids', () => {
		expect(() => new SkillFactory('9999_unknown')).toThrow('Invalid skill ID');
	});

	it('applies default cost, delay, cooldown, and affinity when omitted from definition', () => {
		const skill = new SkillFactory('0001_attack');
		const definition = SKILLS['0001_attack'];

		expect(definition.cost).toBeUndefined();
		expect(definition.delay).toBeUndefined();
		expect(definition.cooldown).toBeUndefined();
		expect(definition.affinity).toBeUndefined();
		expect(definition.requirements).toBeUndefined();
		expect(definition.statRequirements).toBeUndefined();

		expect(skill.cost).toEqual(resolveSkillCost(definition));
		expect(skill.delay).toBe(resolveSkillDelay(definition));
		expect(skill.cooldown).toBe(resolveSkillCooldown(definition));
		expect(skill.affinity).toEqual(resolveSkillAffinity(definition));
		expect(skill.skillRequirements).toBe(resolveSkillRequirements(definition));
		expect(skill.statRequirements).toBe(resolveSkillStatRequirements(definition));
		expect(skill.cost).toEqual({ [SCALES.HP]: 0, [SCALES.MP]: 0 });
		expect(skill.delay).toBe(0);
		expect(skill.cooldown).toBe(0);
		expect(skill.affinity).toEqual({ [SKILL_AFFINITY.PHYSICAL]: 1 });
		expect(skill.skillRequirements).toBeUndefined();
		expect(skill.statRequirements).toBeUndefined();
	});

	it('exposes skillRequirements from definition.requirements', () => {
		const skill = new SkillFactory('0001_attack');

		expect(skill.skillRequirements).toBe(SKILLS['0001_attack'].requirements);
	});

	it.each(Object.entries(SKILLS))(
		'[%s] constructs from skills index and matches definition',
		(registryKey, definition) => {
			expect(registryKey).toBe(definition.id);

			const skill = new SkillFactory(registryKey);

			expectSkillFactoryMatchesDefinition(skill, definition, registryKey);
		}
	);
});
