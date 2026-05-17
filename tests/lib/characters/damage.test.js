import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/enums';
import { BaseCharacter, createEmptyEquipment, GENDER } from '$lib/characters';

describe('characters/estimateDamage', () => {
	it('uses class statWeights for dominant scale and skill scaling for physical attack', () => {
		const stats = {
			[SCALES.STRENGTH]: 20,
			[SCALES.AGILITY]: 8,
			[SCALES.VITALITY]: 8,
			[SCALES.INTELLIGENCE]: 5,
			[SCALES.DEXTERITY]: 8,
			[SCALES.LUCK]: 4
		};

		const swordsman = new BaseCharacter({
			classId: 'swordsman',
			level: 5,
			gender: GENDER.MALE,
			scales: stats
		});

		const mage = new BaseCharacter({
			classId: 'mage',
			level: 5,
			gender: GENDER.FEMALE,
			scales: stats
		});

		expect(swordsman.estimateDamage('0001_attack').damage).toBeGreaterThan(
			mage.estimateDamage('0001_attack').damage
		);
	});

	it('includes equipped weapon bonuses', () => {
		const unarmed = new BaseCharacter({
			classId: 'peasant',
			level: 5,
			equipment: { ...createEmptyEquipment(), weapon: null }
		});

		const armed = new BaseCharacter({
			classId: 'peasant',
			level: 5,
			equipment: { ...createEmptyEquipment(), weapon: 'i_w_001' }
		});

		expect(armed.getEquippedWeapon()?.id).toBe('i_w_001');
		expect(armed.estimateDamage('0001_attack').damage).toBeGreaterThan(
			unarmed.estimateDamage('0001_attack').damage
		);
	});

	it('rolls class base damage when randomizing', () => {
		const peasant = new BaseCharacter({ classId: 'peasant', level: 1 });
		const rolls = new Set(
			Array.from(
				{ length: 30 },
				() => peasant.estimateDamage('0001_attack', { randomizeBaseDamage: true }).damage
			)
		);

		expect(rolls.size).toBeGreaterThan(1);
	});
});
