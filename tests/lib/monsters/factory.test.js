import { describe, expect, it } from 'vitest';

import { SCALES } from '$lib/enums';
import { getTotalStatPoints } from '$lib/progression';
import MONSTERS from '$lib/monsters';
import { buildMonsterStats, createMonsterSpec } from '$lib/monsters/factory';
import BaseMonster from '$lib/monsters/controller';

import { expectMonsterSpecMatchesLevel } from './validateDefinition.js';

describe('monsters/factory', () => {
	it('builds level 4 jelly with 12 allocated stat points', () => {
		const definition = MONSTERS['0001_jelly'];
		const spec = createMonsterSpec({ monsterId: '0001_jelly', level: 4 });

		expectMonsterSpecMatchesLevel(spec, definition, 4, '0001_jelly');
		expect(spec.maxHp).toBe(
			(definition.baseVitals?.hp ?? 0) + (spec.scales[SCALES.VITALITY] ?? 0) * 5
		);
	});

	it('is deterministic for the same monster and level', () => {
		const first = buildMonsterStats(MONSTERS['0002_fabre'], 4);
		const second = buildMonsterStats(MONSTERS['0002_fabre'], 4);

		expect(first).toEqual(second);
	});

	it('scales allocated points when level increases', () => {
		const low = createMonsterSpec({ monsterId: '0001_jelly', level: 1 });
		const high = createMonsterSpec({ monsterId: '0001_jelly', level: 4 });

		const sumLow = Object.values(low.scales).reduce((sum, value) => sum + value, 0);
		const sumHigh = Object.values(high.scales).reduce((sum, value) => sum + value, 0);

		expect(sumLow).toBe(getTotalStatPoints(1));
		expect(sumHigh).toBe(getTotalStatPoints(4));
		expect(sumHigh).toBeGreaterThan(sumLow);
	});

	it('exposes stats through BaseMonster', () => {
		const monster = new BaseMonster({ monsterId: '0001_jelly', level: 4 });

		expect(monster.level).toBe(4);
		expect(monster.stats[SCALES.VITALITY]).toBe(monster.scales[SCALES.VITALITY]);
		expect(monster.maxHp).toBeGreaterThan(monster.spec.baseVitals.hp);
	});
});
