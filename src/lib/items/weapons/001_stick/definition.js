/** Weapon - Stick definition */

import { RARITY, SCALES } from '$lib/enums';
import { ITEM_CATEGORIES } from '$lib/items/enums';

export default {
	id: 'i_w_001',
	name: 'Stick',
	description: 'A stick is a simple weapon that can be used to attack enemies.',
	tier: 0,
	category: ITEM_CATEGORIES.WEAPON,
	rarity: RARITY.COMMON,
	scales: {
		[SCALES.HP]: 0,
		[SCALES.MP]: 0,
		[SCALES.STRENGTH]: .5,
		[SCALES.AGILITY]: 0,
		[SCALES.VITALITY]: 0,
		[SCALES.INTELLIGENCE]: 0,
		[SCALES.DEXTERITY]: 0.5,
		[SCALES.LUCK]: 0
	},
	damage: {
		min: 0.5,
		max: 1
	}
};
