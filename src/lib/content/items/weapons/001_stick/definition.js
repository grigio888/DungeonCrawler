/** Weapon - Stick definition */

import { ITEM_CATEGORIES, RARITY } from '$lib/core/enum/items.js';
import { SCALES } from '$lib/core/enum/stats.js';

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
		[SCALES.STRENGTH]: 0.5,
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
