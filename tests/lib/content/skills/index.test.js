import { describe, expect, it } from 'vitest';

import SKILLS from '$lib/content/skills';

import { expectSkillDefinition } from './validateDefinition.js';

describe('skills/index', () => {
	it('registers at least one skill', () => {
		expect(Object.keys(SKILLS).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(SKILLS))('[%s] registry key matches definition id', (key, definition) => {
		expect(key).toBe(definition.id);
	});

	it.each(Object.values(SKILLS))('$id matches the expected skill structure', (definition) => {
		expectSkillDefinition(definition, definition.id);
	});
});
