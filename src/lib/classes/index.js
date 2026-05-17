/** Classes index */

export { default } from './registry.js';

export const CLASS_IDS = {
	PEASANT: 'peasant',
	SWORDSMAN: 'swordsman',
	MAGE: 'mage'
};

export { buildClassStats, getClassDefinition, resolvePromptPath } from './factory.js';
