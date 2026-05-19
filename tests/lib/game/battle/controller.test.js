import { describe, expect, it, vi } from 'vitest';

import { BaseCharacter, GENDER } from '$lib/game/entities/character';
import { Environment } from '$lib/content/environments';
import { Battle } from '$lib/game/battle';
import { BaseMonster } from '$lib/game/entities/monster';
import { FACING } from '$lib/game/presentation/sprites';

describe('battle/controller', () => {
	function createSetup() {
		return {
			player: new BaseCharacter({
				classId: 'peasant',
				level: 5,
				gender: GENDER.FEMALE,
				name: 'Hero'
			}),
			opponent: new BaseMonster({ monsterId: '0001_jelly', level: 3 }),
			environment: new Environment('forest_clearing')
		};
	}

	it('accepts player, opponent, and environment', () => {
		const setup = createSetup();
		const battle = new Battle(setup);

		expect(battle.player).toBe(setup.player);
		expect(battle.opponent).toBe(setup.opponent);
		expect(battle.environment).toBe(setup.environment);
		expect(battle.turn).toBe('player');
		expect(battle.phase).toBe('active');
	});

	it('resolves player victory when opponent is defeated', () => {
		const battle = new Battle(createSetup());
		battle.opponent.takeDamage(Math.max(0, battle.opponent.hp - 1));

		const result = battle.playerAttack();

		expect(result.defenderDefeated).toBe(true);
		expect(battle.phase).toBe('victory');
		expect(battle.winner).toBe('player');
		expect(battle.isOver).toBe(true);
	});

	it('alternates turns until blocked by phase', () => {
		const battle = new Battle(createSetup());

		battle.playerAttack();
		expect(battle.turn).toBe('opponent');

		battle.opponentAttack();
		expect(battle.turn).toBe('player');
	});

	it('snapshots include gender-based sprite key for characters', () => {
		const battle = new Battle(createSetup());
		const snapshot = battle.getSnapshot('player');

		expect(snapshot.kind).toBe('character');
		expect(snapshot.spriteKey).toBe(`female_idle_${FACING.SW}`);
	});

	it('records critical hits on battle actions', () => {
		const random = vi.spyOn(Math, 'random');
		random.mockReturnValueOnce(0); // force critical on first damage roll

		const battle = new Battle(createSetup());
		const result = battle.playerAttack();

		expect(result.isCritical).toBe(true);
		expect(battle.lastAction?.isCritical).toBe(true);

		random.mockRestore();
	});

	it('reset restores vitals and battle flow', () => {
		const battle = new Battle(createSetup());

		battle.playerAttack();
		battle.opponentAttack();
		battle.reset();

		expect(battle.phase).toBe('active');
		expect(battle.turn).toBe('player');
		expect(battle.log).toEqual([]);
		expect(battle.lastAction).toBeNull();
		expect(battle.player.hp).toBe(battle.player.maxHp);
		expect(battle.opponent.hp).toBe(battle.opponent.maxHp);
	});
});
