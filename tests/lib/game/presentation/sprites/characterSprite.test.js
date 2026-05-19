import { describe, expect, it } from 'vitest';

import { GENDER } from '$lib/game/entities/character';
import { FACING } from '$lib/game/presentation/sprites';
import { resolveFacing } from '$lib/core/helpers/sprites.js';
import { buildCharacterSpriteKey } from '$lib/game/presentation/sprites/characterSprite.js';

describe('sprites/characterSprite', () => {
	it('builds keys for diagonal facings', () => {
		expect(buildCharacterSpriteKey(GENDER.FEMALE, FACING.SW)).toBe('female_idle_sw');
		expect(buildCharacterSpriteKey(GENDER.MALE, FACING.SE)).toBe('male_idle_se');
		expect(buildCharacterSpriteKey(GENDER.FEMALE, FACING.NW)).toBe('female_idle_nw');
		expect(buildCharacterSpriteKey(GENDER.FEMALE, FACING.NE)).toBe('female_idle_ne');
	});

	it('defaults to south-west when facing is missing or invalid', () => {
		expect(resolveFacing(undefined)).toBe(FACING.SW);
		expect(resolveFacing('south')).toBe(FACING.SW);
		expect(buildCharacterSpriteKey(GENDER.FEMALE)).toBe('female_idle_sw');
	});

	it('supports non-idle animation keys', () => {
		expect(buildCharacterSpriteKey(GENDER.FEMALE, FACING.NE, 'dead')).toBe('female_dead_ne');
	});
});
