import { describe, expect, it } from 'vitest';

import {
	getMonsterSpritePath,
	listMonsterSpriteFiles,
	resolveMonsterSpriteUrl
} from '$lib/game/presentation/sprites/monsterSprite.js';

describe('sprites/monsterSprite', () => {
	const glob = {
		'/project/src/lib/content/monsters/0001_jelly/sprites/idle.png': '/assets/jelly-idle.png',
		'/project/src/lib/content/monsters/0002_fabre/sprites/idle.png': '/assets/fabre-idle.png',
		'/project/src/lib/content/monsters/0002_fabre/sprites/walk.png': '/assets/fabre-walk.png'
	};

	it('resolves idle.png by convention', () => {
		expect(resolveMonsterSpriteUrl(glob, '0002_fabre')).toBe('/assets/fabre-idle.png');
	});

	it('lists image files in a monster sprites folder', () => {
		expect(listMonsterSpriteFiles(glob, '0002_fabre')).toEqual(['idle.png', 'walk.png']);
	});

	it('documents the expected on-disk path', () => {
		expect(getMonsterSpritePath('0002_fabre')).toBe(
			'src/lib/content/monsters/0002_fabre/sprites/idle.png'
		);
	});

	it('loads sprites from the repo via Vite glob', () => {
		const sprites = import.meta.glob('$lib/content/monsters/*/sprites/*.{png,webp,gif}', {
			eager: true,
			query: '?url',
			import: 'default'
		});

		expect(resolveMonsterSpriteUrl(sprites, '0001_jelly')).toBeTruthy();
		expect(resolveMonsterSpriteUrl(sprites, '0002_fabre')).toBeTruthy();
	});
});
