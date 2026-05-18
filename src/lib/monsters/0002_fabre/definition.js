/** Monster — Fabre definition */

import { SCALES } from '$lib/enums';
import { MONSTER_KIND } from '../enums';

export default {
	id: '0002_fabre',
	name: 'Fabre',
	description: 'A small green caterpillar monster.',
	kind: MONSTER_KIND.NORMAL,
	tier: 0,
	level: 1,
	exp: 10,
	statWeights: {
		[SCALES.STRENGTH]: 0.1,
		[SCALES.AGILITY]: 0.25,
		[SCALES.VITALITY]: 0.35,
		[SCALES.INTELLIGENCE]: 0.05,
		[SCALES.DEXTERITY]: 0.15,
		[SCALES.LUCK]: 0.1
	},
	baseVitals: {
		hp: 14,
		mp: 2
	},
	baseDamage: {
		min: 1,
		max: 3
	},
	skills: ['0001_attack']
};
