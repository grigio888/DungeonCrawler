/** Equipment - Cloth shirt definition */

import { EQUIPMENT_SLOTS, ITEM_CATEGORIES, RARITY } from '$lib/core/enum/items.js';
import { SCALES } from '$lib/core/enum/stats.js';

export default {
	id: 'i_e_001',
	name: 'Cloth Shirt',
	description: 'A simple cloth shirt that offers minimal protection.',
	tier: 0,
	category: ITEM_CATEGORIES.ARMOR,
	slot: EQUIPMENT_SLOTS.ARMOR,
	rarity: RARITY.COMMON,
	scales: {
		[SCALES.HP]: 0,
		[SCALES.MP]: 0,
		[SCALES.STRENGTH]: 0,
		[SCALES.AGILITY]: 0,
		[SCALES.VITALITY]: 0.25,
		[SCALES.INTELLIGENCE]: 0,
		[SCALES.DEXTERITY]: 0,
		[SCALES.LUCK]: 0
	},
	defense: {
		min: 1,
		max: 2
	}
};
