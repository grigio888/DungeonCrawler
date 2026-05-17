import { describe, expect, it } from 'vitest';

import ENVIRONMENTS, { Environment } from '$lib/environments';

import { expectEnvironmentDefinition } from './validateDefinition.js';

describe('environments/index', () => {
	it('registers environments', () => {
		expect(Object.keys(ENVIRONMENTS).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(ENVIRONMENTS))(
		'[%s] registry key matches definition id',
		(key, definition) => {
			expect(key).toBe(definition.id);
		}
	);

	it.each(Object.values(ENVIRONMENTS))('$id matches the expected structure', (definition) => {
		expectEnvironmentDefinition(definition, definition.id);
	});

	it('constructs Environment from id', () => {
		const env = new Environment('forest_clearing');
		expect(env.id).toBe('forest_clearing');
		expect(env.name).toBe(ENVIRONMENTS.forest_clearing.name);
	});
});
