/** Mage class definition */

import { SCALES } from '$lib/core/enum/stats.js';

export default {
	id: 'mage',
	name: 'Mage',
	description: 'A spellcaster with fragile health but deep mana reserves.',
	promptPath: 'class 1/mage',
	tier: 1,
	level: 1,
	jobRequirements: ['peasant'],
	skills: ['0001_attack'],
	statWeights: {
		[SCALES.STRENGTH]: 0.05,
		[SCALES.AGILITY]: 0.1,
		[SCALES.VITALITY]: 0.1,
		[SCALES.INTELLIGENCE]: 0.4,
		[SCALES.DEXTERITY]: 0.15,
		[SCALES.LUCK]: 0.2
	},
	baseDamage: {
		min: 1,
		max: 4
	},
	baseVitals: {
		hp: 18,
		mp: 24
	},
	vitalProgression: {
		hpPerLevel: 3,
		spPerLevel: 10
	}
};
