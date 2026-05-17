import { describe, expect, it } from 'vitest';

import CLASSES from '$lib/classes';

import { expectClassDefinition } from './validateDefinition.js';

describe('classes/index', () => {
	it('registers at least one class', () => {
		expect(Object.keys(CLASSES).length).toBeGreaterThan(0);
	});

	it.each(Object.entries(CLASSES))('[%s] registry key matches definition id', (key, definition) => {
		expect(key).toBe(definition.id);
	});

	it.each(Object.values(CLASSES))('$id matches the expected class structure', (definition) => {
		expectClassDefinition(definition, definition.id, CLASSES);
	});

	it('jobRequirements only reference registered classes', () => {
		const registeredIds = new Set(Object.keys(CLASSES));

		for (const definition of Object.values(CLASSES)) {
			for (const jobId of definition.jobRequirements) {
				expect(registeredIds.has(jobId), `${definition.id} → ${jobId}`).toBe(true);
			}
		}
	});
});
