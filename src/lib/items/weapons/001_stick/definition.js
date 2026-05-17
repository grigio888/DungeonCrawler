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
		[SCALES.HP]: 1,
		[SCALES.MP]: 1,
		[SCALES.STRENGTH]: 1,
		[SCALES.AGILITY]: 1,
		[SCALES.VITALITY]: 1,
		[SCALES.INTELLIGENCE]: 0.5,
		[SCALES.DEXTERITY]: 0.5,
		[SCALES.LUCK]: 0.5
	},
	damage: {
		min: 1,
		max: 1
	}
};
