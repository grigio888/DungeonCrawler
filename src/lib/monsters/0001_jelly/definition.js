/** Monster — Jelly definition */

import { SCALES } from '$lib/enums';
import { MONSTER_KIND } from '../enums';

export default {
	id: '0001_jelly',
	name: 'Jelly',
	description: 'A jelly blob monster.',
	kind: MONSTER_KIND.NORMAL,
	tier: 0,
	level: 1,
	exp: 10,
	statWeights: {
		[SCALES.STRENGTH]: 0.2,
		[SCALES.AGILITY]: 0.1,
		[SCALES.VITALITY]: 0.35,
		[SCALES.INTELLIGENCE]: 0.05,
		[SCALES.DEXTERITY]: 0.15,
		[SCALES.LUCK]: 0.15
	},
	baseVitals: {
		hp: 10,
		mp: 5
	},
	skills: ['0001_attack']
};
