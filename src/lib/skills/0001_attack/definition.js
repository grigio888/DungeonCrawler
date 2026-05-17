// ** Skills - 0001_attack definition */

import { SCALES, TIERS } from '$lib/enums';
import { SKILL_TARGET, SKILL_TYPES } from '$lib/skills/enums';

export default {
	id: '0001_attack',
	name: 'Attack',
	description: 'Attack an enemy with a weapon.',
	icon: null,
	tier: TIERS.BASIC,
	type: SKILL_TYPES.OFFENSIVE,
	target: SKILL_TARGET.ENEMY,
	scales: {
		[SCALES.HP]: 0,
		[SCALES.MP]: 0,
		[SCALES.STRENGTH]: 0.2,
		[SCALES.AGILITY]: 0,
		[SCALES.VITALITY]: 0,
		[SCALES.INTELLIGENCE]: 0,
		[SCALES.DEXTERITY]: 0.2,
		[SCALES.LUCK]: 0.1
	}
};
