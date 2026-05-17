/** Swordsman class definition */

import { SCALES } from '$lib/enums';

export default {
	id: 'swordsman',
	name: 'Swordsman',
	description: 'A front-line fighter with high durability.',
	promptPath: 'class 1/swordman',
	tier: 1,
	level: 1,
	jobRequirements: ['peasant'],
	skills: ['0001_attack'],
	statWeights: {
		[SCALES.STRENGTH]: 0.35,
		[SCALES.AGILITY]: 0.1,
		[SCALES.VITALITY]: 0.25,
		[SCALES.INTELLIGENCE]: 0.05,
		[SCALES.DEXTERITY]: 0.15,
		[SCALES.LUCK]: 0.1
	},
	baseDamage: {
		min: 2,
		max: 6
	},
	baseVitals: {
		hp: 40,
		mp: 8
	},
	vitalProgression: {
		hpPerLevel: 12,
		spPerLevel: 2
	}
};
