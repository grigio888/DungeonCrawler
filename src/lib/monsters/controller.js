import { createMonsterSpec } from './factory.js';

/**
 * Owns a single monster's runtime spec: identity, vitals, and combat stats.
 */
export default class BaseMonster {
	/** @param {import('./factory.js').MonsterSpec | Record<string, unknown>} [input] */
	constructor(input = {}) {
		this._spec = createMonsterSpec(input);
	}

	get spec() {
		return this._spec;
	}

	get id() {
		return this._spec.id;
	}

	get monsterId() {
		return this._spec.monsterId;
	}

	get name() {
		return this._spec.name;
	}

	get kind() {
		return this._spec.kind;
	}

	get level() {
		return this._spec.level;
	}

	get hp() {
		return this._spec.hp;
	}

	get maxHp() {
		return this._spec.maxHp;
	}

	get sp() {
		return this._spec.sp;
	}

	get maxSp() {
		return this._spec.maxSp;
	}

	get scales() {
		return this._spec.scales;
	}

	/** Allocated combat stats (same keys as `scales`). */
	get stats() {
		return this._spec.scales;
	}

	get skills() {
		return this._spec.skills;
	}

	get isAlive() {
		return this._spec.hp > 0;
	}

	/** Relative path under `monsters/` (e.g. `0001_poring`). */
	get promptPath() {
		return this._spec.monsterId;
	}

	get displayLabel() {
		return `${this._spec.name} (${this._spec.kind})`;
	}

	/**
	 * @param {Partial<import('./factory.js').MonsterSpec>} patch
	 */
	patch(patch) {
		this._spec = createMonsterSpec({ ...this._spec, ...patch });
		return this;
	}

	/**
	 * @param {number} amount
	 */
	heal(amount) {
		this._spec.hp = Math.min(this._spec.maxHp, this._spec.hp + amount);
		return this._spec.hp;
	}

	/**
	 * @param {number} amount
	 */
	restoreSp(amount) {
		this._spec.sp = Math.min(this._spec.maxSp, this._spec.sp + amount);
		return this._spec.sp;
	}

	/**
	 * @param {number} amount
	 * @returns {number}
	 */
	takeDamage(amount) {
		const applied = Math.max(0, amount);
		this._spec.hp = Math.max(0, this._spec.hp - applied);
		return applied;
	}

	/**
	 * @param {number} amount
	 */
	spendSp(amount) {
		if (this._spec.sp < amount) return false;
		this._spec.sp -= amount;
		return true;
	}

	toJSON() {
		return structuredClone(this._spec);
	}

	/**
	 * @param {import('./factory.js').MonsterSpec | Record<string, unknown>} data
	 */
	static fromJSON(data) {
		return new BaseMonster(data);
	}
}
