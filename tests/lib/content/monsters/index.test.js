import { describe, expect, it } from 'vitest';

import MONSTERS from '$lib/content/monsters';

import { expectMonsterDefinition } from './validateDefinition.js';

describe('monsters/index', () => {
	it('registers at least one monster', () => {
		expect(Object.keys(MONSTERS).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(MONSTERS))(
		'[%s] registry key matches definition id',
		(key, definition) => {
			expect(key).toBe(definition.id);
		}
	);

	it.each(Object.values(MONSTERS))('$id matches the expected monster structure', (definition) => {
		expectMonsterDefinition(definition, definition.id);
	});
});
