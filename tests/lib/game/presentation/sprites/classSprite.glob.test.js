import { describe, expect, it } from 'vitest';

import { GENDER } from '$lib/game/entities/character';
import {
	buildCharacterSpriteKey,
	listClassSpriteOptions,
	resolveClassSpriteUrl
} from '$lib/game/presentation/sprites';
import {
	matchesClassSpritePath,
	pathMatchesClassSpriteFolder
} from '$lib/game/presentation/sprites/classSpritePath.js';

const sprites = import.meta.glob('$lib/content/classes/**/sprites/*.{png,webp,gif}', {
	eager: true,
	query: '?url',
	import: 'default'
});

describe('sprites/classSprite glob', () => {
	it('includes mage female idle sprites in the Vite glob', () => {
		const paths = Object.keys(sprites);
		const magePaths = paths.filter((path) => path.includes('mage') && path.includes('sprites'));

		expect(magePaths.length).toBeGreaterThan(0);
		expect(magePaths.some((path) => path.includes('female_idle_sw'))).toBe(true);
	});

	it('matches paths with spaces and content/ prefix', () => {
		const sample = '/src/lib/content/classes/class 1/mage/sprites/female_idle_sw.png';
		const encoded = '/src/lib/content/classes/class%201/mage/sprites/female_idle_sw.png';

		expect(pathMatchesClassSpriteFolder(sample, 'class 1/mage')).toBe(true);
		expect(pathMatchesClassSpriteFolder(encoded, 'class 1/mage')).toBe(true);
		expect(matchesClassSpritePath(sample, 'class 1/mage', 'female_idle_sw')).toBe(true);
	});

	it('resolves mage sprite URL from glob entries', () => {
		const promptPath = 'class 1/mage';
		const key = buildCharacterSpriteKey(GENDER.FEMALE, 'sw', 'idle');
		const url = resolveClassSpriteUrl(sprites, promptPath, key, GENDER.FEMALE);

		expect(url).toBeTruthy();
	});

	it('lists mage idle facings for female', () => {
		const options = listClassSpriteOptions(sprites, 'class 1/mage', GENDER.FEMALE);

		expect(options.animations).toContain('idle');
		expect(options.facingsByAnimation.idle?.length).toBeGreaterThan(0);
	});

	it('returns no options for male mage (sprites are female-only)', () => {
		const options = listClassSpriteOptions(sprites, 'class 1/mage', GENDER.MALE);

		expect(options.animations).toEqual([]);
	});
});
