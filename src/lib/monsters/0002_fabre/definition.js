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
	statWeights: {
		[SCALES.STRENGTH]: 0.1,
		[SCALES.AGILITY]: 0.3,
		[SCALES.VITALITY]: 0.15,
		[SCALES.INTELLIGENCE]: 0.05,
		[SCALES.DEXTERITY]: 0.3,
		[SCALES.LUCK]: 0.1
	},
	baseVitals: {
		hp: 8,
		mp: 5
	},
	skills: ['0001_attack']
};
