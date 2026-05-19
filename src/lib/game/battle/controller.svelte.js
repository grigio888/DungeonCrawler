import { resolveCombatantDamage, snapshotCombatant } from './combatant.js';

/** @typedef {import('./types.js').BattleSetup} BattleSetup */
/** @typedef {import('./types.js').BattleActionResult} BattleActionResult */
/** @typedef {import('./types.js').BattlePhase} BattlePhase */
/** @typedef {import('./types.js').BattleTurn} BattleTurn */
/** @typedef {import('./types.js').BattleWinner} BattleWinner */
/** @typedef {import('./types.js').BattleSide} BattleSide */
/** @typedef {import('./types.js').BattleCombatant} BattleCombatant */

/**
 * Turn-based encounter between a player character, an opponent, and an environment.
 * Uses Svelte runes so UI can subscribe to battle state directly.
 */
export default class Battle {
	/** @param {BattleSetup} setup */
	constructor(setup) {
		this.player = setup.player;
		this.opponent = setup.opponent;
		this.environment = setup.environment;
	}

	turn = $state(/** @type {BattleTurn} */ ('player'));
	phase = $state(/** @type {BattlePhase} */ ('active'));
	winner = $state(/** @type {BattleWinner} */ (null));
	log = $state(/** @type {BattleActionResult[]} */ ([]));
	lastAction = $state(/** @type {BattleActionResult | null} */ (null));

	/** Bumped after combat mutations so derived snapshots stay in sync with HP/SP. */
	revision = $state(0);

	isOver = $derived(this.phase !== 'active');

	playerSnapshot = $derived.by(() => {
		this.revision;
		return snapshotCombatant(this.player, 'player');
	});

	opponentSnapshot = $derived.by(() => {
		this.revision;
		return snapshotCombatant(this.opponent, 'opponent');
	});

	/**
	 * @param {BattleSide} side
	 * @returns {BattleCombatant}
	 */
	getCombatant(side) {
		return side === 'player' ? this.player : this.opponent;
	}

	/**
	 * @param {BattleSide} side
	 */
	getSnapshot(side) {
		this.revision;
		return snapshotCombatant(this.getCombatant(side), side);
	}

	/**
	 * @param {BattleSide} attackerSide
	 * @param {string} [skillId]
	 * @returns {BattleActionResult}
	 */
	performAttack(attackerSide, skillId = '0001_attack') {
		if (this.isOver) {
			return this.#blockedResult(attackerSide, skillId);
		}

		if (this.turn !== attackerSide) {
			return this.#blockedResult(attackerSide, skillId);
		}

		const attacker = this.getCombatant(attackerSide);
		const defenderSide = attackerSide === 'player' ? 'opponent' : 'player';
		const defender = this.getCombatant(defenderSide);

		if (!attacker.isAlive || !defender.isAlive) {
			return this.#blockedResult(attackerSide, skillId);
		}

		const { damage, isCritical } = resolveCombatantDamage(attacker, skillId);
		defender.takeDamage(damage);

		const defenderDefeated = !defender.isAlive;
		this.#resolveOutcome(defenderSide, defenderDefeated);

		/** @type {BattleActionResult} */
		const result = {
			attacker: attackerSide,
			defender: defenderSide,
			skillId,
			damage,
			isCritical,
			defenderDefeated,
			phase: this.phase,
			winner: this.winner
		};

		this.log = [...this.log, result];
		this.lastAction = result;
		this.#touch();

		if (!this.isOver) {
			this.turn = defenderSide;
		}

		return result;
	}

	/** @returns {BattleActionResult} */
	playerAttack(skillId = '0001_attack') {
		return this.performAttack('player', skillId);
	}

	/** @returns {BattleActionResult} */
	opponentAttack(skillId = '0001_attack') {
		return this.performAttack('opponent', skillId);
	}

	/** Restores vitals and resets turn/phase state (same entity instances). */
	reset() {
		this.#restoreCombatant(this.player);
		this.#restoreCombatant(this.opponent);
		this.turn = 'player';
		this.phase = 'active';
		this.winner = null;
		this.log = [];
		this.lastAction = null;
		this.#touch();
	}

	/**
	 * @param {BattleCombatant} entity
	 */
	#restoreCombatant(entity) {
		entity.heal(entity.maxHp);
		entity.restoreSp(entity.maxSp);
	}

	#touch() {
		this.revision += 1;
	}

	/**
	 * @param {BattleSide} defeatedSide
	 * @param {boolean} defeated
	 */
	#resolveOutcome(defeatedSide, defeated) {
		if (!defeated) return;

		if (defeatedSide === 'opponent') {
			this.phase = 'victory';
			this.winner = 'player';
			return;
		}

		this.phase = 'defeat';
		this.winner = 'opponent';
	}

	/**
	 * @param {BattleSide} attackerSide
	 * @param {string} [skillId]
	 * @returns {BattleActionResult}
	 */
	#blockedResult(attackerSide, skillId) {
		return {
			attacker: attackerSide,
			defender: attackerSide === 'player' ? 'opponent' : 'player',
			skillId,
			damage: 0,
			isCritical: false,
			defenderDefeated: false,
			phase: this.phase,
			winner: this.winner
		};
	}
}
