import { expect } from 'vitest';

const ENVIRONMENT_ID_PATTERN = /^[a-z][a-z0-9_]*$/;

/**
 * @param {unknown} definition
 * @param {string} [label]
 */
export function expectEnvironmentDefinition(definition, label = 'environment') {
	expect(definition, `${label} should be defined`).toBeDefined();
	expect(typeof definition).toBe('object');

	const env = /** @type {Record<string, unknown>} */ (definition);

	expect(env.id, `${label}.id`).toEqual(expect.any(String));
	expect(env.id).toMatch(ENVIRONMENT_ID_PATTERN);
	expect(env.name, `${label}.name`).toEqual(expect.any(String));
	expect(String(env.name).length).toBeGreaterThan(0);
	expect(env.description, `${label}.description`).toEqual(expect.any(String));
}
