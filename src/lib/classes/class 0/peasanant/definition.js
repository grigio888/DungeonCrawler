/** Peasant definition */

import { SCALES } from '$lib/enums';
import Skill from '$lib/skills/factory';

export default {
	id: 'peasant',
	name: 'Peasant',
	description: 'A peasant is a simple character who is not very powerful.',
	tier: 0,
	requirements: [],
	skills: [new Skill('0001_attack')],
	scales: {
		[SCALES.HP]: 100,
		[SCALES.MP]: 10,
		[SCALES.STRENGTH]: 5,
		[SCALES.AGILITY]: 5,
		[SCALES.VITALITY]: 5,
		[SCALES.INTELLIGENCE]: 5,
		[SCALES.DEXTERITY]: 5,
		[SCALES.LUCK]: 5
	}
};
