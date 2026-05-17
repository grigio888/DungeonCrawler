/** Peasant class definition */

import { SCALES } from '$lib/enums';

export default {
	id: 'peasant',
	name: 'Peasant',
	description: 'A peasant is a simple character who is not very powerful.',
	promptPath: 'class 0/peasanant',
	tier: 0,
	level: 1,
	jobRequirements: [],
	skills: ['0001_attack'],
	statWeights: {
		[SCALES.STRENGTH]: 0.17,
		[SCALES.AGILITY]: 0.17,
		[SCALES.VITALITY]: 0.17,
		[SCALES.INTELLIGENCE]: 0.16,
		[SCALES.DEXTERITY]: 0.17,
		[SCALES.LUCK]: 0.16
	},
	baseDamage: {
		min: 1,
		max: 3
	},
	baseVitals: {
		hp: 15,
		mp: 6
	},
	vitalProgression: {
		hpPerLevel: 2.5,
		spPerLevel: 1
	}
};
